import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.responses import FileResponse
from fastapi.openapi.utils import get_openapi
from ml.gpt.gpt import GPT
from ml.gpt.prompts import prompts
from ml.figma.figma_loader import figma_load
from ml.figma.figma_compare import figma_compare
import json
from ml.db.database import set_token_data, get_token_data, delete_token_data
import secrets
import requests
from fastapi.middleware.cors import CORSMiddleware

import re

logger = logging.getLogger('project_logger')
logger.setLevel(logging.INFO)
logger.propagate = False

file_handler = logging.FileHandler('ml/logs/app.log', encoding='utf-8')
file_formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(file_formatter)

console_handler = logging.StreamHandler()
console_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
console_handler.setFormatter(console_formatter)
console_handler.setLevel(logging.ERROR)

logger.addHandler(file_handler)
logger.addHandler(console_handler)


class TaskData(BaseModel):
    description: str
    tasks: List[str]
    project_id: int
    Authtoken: str

class FigmaData(BaseModel):
    project_name: str
    figma_token: str
    figma_file_key: str

class UserAnswer(BaseModel):
    secret: str
    answer: bool
    Authtoken: str

class UserText(BaseModel):
    user_text: str
    Authtoken: str

origins = [
    "http://localhost",
    "http://localhost:5173"
]



_gpt = GPT()
app = FastAPI(
    title="My Project API",
    description="This is an API for managing projects and generating tasks using GPT.",
    version="1.0.0",
    docs_url="/swagger",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

@app.get("/", response_class=FileResponse)
async def root():
    logger.info("Serving root.html")
    try:
        return FileResponse("ml/root.html")
    except Exception as e:
        logger.error(f"Error serving root.html: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/generate_tasks")
def process_tasks(task_data: TaskData) -> dict:
    try:
        project_description = task_data.description
        project_tasks = task_data.tasks
        project_id = task_data.project_id
        Authtoken = task_data.Authtoken

        logger.info(f"Received task data: description={project_description}, tasks={project_tasks}")

        response = _gpt.generate(prompts['tasks_gen'].format(project_description=project_description, project_tasks=', '.join(project_tasks)))
        response['result'] = response['result'].replace('* ', '').split('\n')

        response['result'] = [line.strip() for line in response['result'] if line.strip()]
        response['result'] = [re.sub(r'^\d+\.\s*', '', line) for line in response['result']]

        for string_ in response['result']:
            print(string_)
            r = requests.post(url=f'https://task.shmyaks.ru/v1/projects/{project_id}/tasks', json={'title': string_+'#ai'}, cookies={'Authtoken': Authtoken})
            print(r.json())
        
        logger.info("Task generation successful")
        return response
    except Exception as e:
        logger.error(f"Error processing tasks: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/ai")
def process_ai_helper(usertext: UserText) -> dict:
    user_text = usertext.user_text
    Authtoken = usertext.Authtoken

    try:
        logger.info(f"Received user text: {user_text}")        

        formatted_type_ = _gpt.classify(user_text)['result']

        formatted_type_ = {
            'добавить задачу': 'add_task',
            'удалить задачу': 'delete_task',
            'отметить задачу выполненной': 'check_task',
            'пригласить человека': 'invite_team',
            'удалить человека': 'kick_team',
            'другое': 'other'
        }[formatted_type_]

        logger.info(f"Action type: {formatted_type_}")

        if formatted_type_ == 'other':
            answer = _gpt.generate(prompts['default_answer'].format(user_text=user_text))['result']
            buttons = False
            secret = None
        else:
            buttons = True
            secret = secrets.token_hex(16)

            cookies = {'Authtoken': Authtoken}
            user_projects = requests.get(url='https://task.shmyaks.ru/v1/user/projects', cookies=cookies).json()['projects']
            user_projects = [project['name'] for project in user_projects]
            logger.info(f"User projects: {user_projects}")

            if not user_projects:
                return {'result': 'error', 'data': {'text': 'У вас нет проектов, к которым можно применить действие.', 'buttons': False, 'secret': None}}

            if formatted_type_ == 'add_task':
                action = _gpt.generate(prompts['add_task'].format(user_text=user_text))['result']
                logger.info(f"Action: {action}")

                if not check_answer_valid(action):
                    return {'result': 'error', 'data': {'text': 'Кажется, я не смог понять ваш запрос. Убедитесь, что указали название задачи и проекта.', 'buttons': False, 'secret': None}}

                formatted_action = json.loads(_format(action))

                backup_project = formatted_action['target_project']
                formatted_action['target_project'] = _gpt.compare_projects(formatted_action['target_project'], user_projects)['result']
                logger.info(f"Formatted action: {formatted_action}")

                if formatted_action['target_project'] == 'other':
                    return {'result': 'error', 'data': {'text': f'К сожалению, мне не удалось найти проект "{backup_project}" или у Вас нет к нему доступа.', 'buttons': False, 'secret': None}}

                project_id = get_project_id_by_name(requests.get(url='https://task.shmyaks.ru/v1/user/projects', cookies=cookies).json(), formatted_action['target_project'])
                project_tasks = requests.get(url=f'https://task.shmyaks.ru/v1/projects/{project_id}', cookies=cookies).json()
                tasks = [task['title'].lower() for task in project_tasks['tasks']]
                logger.info(f"Existing: {tasks}")

                if formatted_action['task'].lower() in tasks:
                    return {'result': 'error', 'data': {'text': f'Кажется, задача "{formatted_action["task"]}" уже существует в проекте "{formatted_action["target_project"]}".', 'buttons': False, 'secret': None}}

                formatted_action['project_id'] = project_id
                project_users = requests.get(url=f'https://task.shmyaks.ru/v1/projects/{project_id}/users', cookies=cookies).json()
                role_name_dict = {user['role']: user['name'] for user in project_users['users']}
                logger.info(f"Role name dict: {role_name_dict}")

                most_suitable_role = _gpt.compare_role_task(formatted_action['task'], list(role_name_dict.keys()))['result']
                if 'error' in most_suitable_role:
                    return {'result': 'error', 'data': {'text': 'Кажется, вы один в команде, поэтому я не смогу корректно провести размышления насчет лучшего исполнителя для задачи.', 'buttons': False, 'secret': None}}
                logger.info(f"Most suitable role: {most_suitable_role}")

                worker_name = role_name_dict[most_suitable_role]
                formatted_action['worker_name'] = worker_name

                answer = prompts['add_task_answer'].format(project=formatted_action['target_project'], task=formatted_action['task'], worker_name=worker_name)
                logger.info(f"Answer: {answer}")

                logger.info(f'Done processing task, result:\n{formatted_action}')
                set_token_data(secret, json.dumps(formatted_action))

            elif formatted_type_ == 'invite_team':
                return {'result': 'error', 'data': {'text': 'Извините, но я еще не умею добавлять и удалять пользователей из проекта.', 'buttons': False, 'secret': None}}
                # action = _gpt.generate(prompts['invite_team'].format(user_text=user_text))['result']
                # formatted_action = json.loads(_format(action))

                # if formatted_action['role'] == 'None':
                #     return {'result': 'error', 'data': {'text': 'К сожалению, я не смог определить желаемую роль пользователя, попробуйте еще раз.', 'buttons': False, 'secret': None}}

                # backup_project = formatted_action['target_project']
                # formatted_action['target_project'] = _gpt.compare_projects(formatted_action['target_project'], user_projects)['result']
                # logger.info(f"Formatted action: {formatted_action}")

                # project_id = get_project_id_by_name(requests.get(url='https://task.shmyaks.ru/v1/user/projects', cookies=cookies).json(), formatted_action['target_project'])
                # formatted_action['project_id'] = project_id

                # if formatted_action['target_project'] == 'other':
                #     return {'result': 'error', 'data': {'text': f'К сожалению, мне не удалось найти проект "{backup_project}" или у Вас нет к нему доступа.', 'buttons': False, 'secret': None}}
                
                # similar_role = _gpt.find_similar_role(formatted_action['role'])['result']

                # formatted_action['role'] = similar_role

                # answer = prompts['invite_team_answer'].format(project=formatted_action['target_project'], user=formatted_action['nickname'], role=similar_role)
                # set_token_data(secret, json.dumps(formatted_action))
            
            elif formatted_type_ == 'kick_team':
                return {'result': 'error', 'data': {'text': 'Извините, но я еще не умею добавлять и удалять пользователей из проекта.', 'buttons': False, 'secret': None}}
            
            elif formatted_type_ == 'delete_task':
                action = _gpt.generate(prompts['delete_task'].format(user_text=user_text))['result']
                logger.info(f"Action: {action}")

                formatted_action = json.loads(_format(action))

                backup_project = formatted_action['target_project']
                formatted_action['target_project'] = _gpt.compare_projects(formatted_action['target_project'], user_projects)['result']
                logger.info(f"Formatted action: {formatted_action}")

                if formatted_action['target_project'] == 'other':
                    return {'result': 'error', 'data': {'text': f'К сожалению, мне не удалось найти проект "{backup_project}" или у Вас нет к нему доступа.', 'buttons': False, 'secret': None}}

                project_id = get_project_id_by_name(requests.get(url='https://task.shmyaks.ru/v1/user/projects', cookies=cookies).json(), formatted_action['target_project'])
                formatted_action['project_id'] = project_id
                
                project_tasks = requests.get(url=f'https://task.shmyaks.ru/v1/projects/{project_id}', cookies=cookies).json()
                project_tasks = {task["title"]: task["id"] for task in project_tasks["tasks"]}

                most_suitable_task = _gpt.compare_projects(formatted_action['task'], list(project_tasks.keys()))['result']
                formatted_action['task'] = most_suitable_task
                logger.info(f"Most suitable task: {most_suitable_task}")

                formatted_action['task_id'] = project_tasks[most_suitable_task]
                logger.info(f"Task id: {formatted_action['task_id']}")
                answer = prompts['delete_task_answer'].format(project=formatted_action['target_project'], task=formatted_action['task'])
                set_token_data(secret, json.dumps(formatted_action))
            
            elif formatted_type_ == 'check_task':
                action = _gpt.generate(prompts['check_task'].format(user_text=user_text))['result']
                formatted_action = json.loads(_format(action))
                answer = prompts['check_task_answer'].format(project=formatted_action['target_project'], task=formatted_action['task'])
                set_token_data(secret, json.dumps(formatted_action))

        

        return {'result': 'success', 'data': {'text': answer, 'buttons': buttons, 'secret': secret}}
    except Exception as e:
        if 'projects' in str(e):
            return {'result': 'error', 'data': {'text': f'Не удалось получить список ваших проектов.\n{e}', 'buttons': False, 'secret': None}}
        
        return {'result': 'error', 'data': {'text': f'Ошибка обработки запроса:\n{e}', 'buttons': False, 'secret': None}}

@app.post("/user_answer")
def process_user_answer(user_answer: UserAnswer) -> dict:
    try:
        logger.info('Starting processing user answer')

        secret = user_answer.secret
        answer = user_answer.answer
        Authtoken = user_answer.Authtoken

        if not answer:
            return {'result': 'success', 'data': {'text': 'Хорошо, я отменил операцию.', 'buttons': False, 'secret': None}}
        else:
            action = get_token_data(secret)
            if action:
                action = json.loads(action)

                delete_token_data(secret)

                if action['type'] == 'add_task':
                    logger.info(f'Adding task: {action}')

                    cookies = {'Authtoken': Authtoken}
                    json_ = {
                        'assignee_name': action['worker_name']
                    }
                    task_id = requests.post(url=f'https://task.shmyaks.ru/v1/projects/{action["project_id"]}/tasks', json={'title': action['task']}).json()['message']['task_id']
                    logger.info(f'Got task id: {task_id}')
                    r = requests.put(url=f'https://task.shmyaks.ru/v1/projects/{action["project_id"]}/tasks/{task_id}', cookies=cookies, json=json_)
                    if r.status_code != 200:
                        return {'result': 'error', 'data': {'text': f'Кажется, произошла ошибка при попытке добавить эту задачу. Думаю, она была не так уж важна...', 'buttons': False, 'secret': None}}
                    return {'result': 'success', 'data': {'text': f'Задача "{action["task"]}" добавлена в проект "{action["target_project"]}" и закреплена за "{action["worker_name"]}"', 'buttons': False, 'secret': None}}
                elif action['type'] == 'invite_team':
                    logger.info(f'Inviting team member: {action}')

                    cookies = {'Authtoken': Authtoken}
                    json_ = {
                        "invitee_name": action['nickname'],
                        "role": action['role']
                    }
                    
                    r = requests.post(url=f'https://task.shmyaks.ru/v1/projects/{action["project_id"]}/invite', cookies=cookies, json=json_)
                    if r.status_code != 200:
                        return {'result': 'error', 'data': {'text': f'К сожалению, у меня произошла ошибка при добавлении человека в команду... Надеюсь, вы справитесь без него!', 'buttons': False, 'secret': None}}
                    return {'result': 'success', 'data': {'text': f'Приглашение в команду отправлено для {action["nickname"]} под ролью {action["role"]}. Хорошей работы вместе!', 'buttons': False, 'secret': None}}
                elif action['type'] == 'kick_team':
                    return {'result': 'success', 'data': {'text': f'Пользователь "{action["nickname"]}" удалён из проекта "{action["target_project"]}"', 'buttons': False, 'secret': None}}
                elif action['type'] == 'delete_task':
                    logger.info(f'Deleting task: {action}')
                    
                    cookies = {'Authtoken': Authtoken}
                    r = requests.delete(url=f'https://task.shmyaks.ru/v1/projects/{action["project_id"]}/tasks/{action["task_id"]}', cookies=cookies)
                    print(r.json())
                    if r.status_code != 200:
                        return {'result': 'error', 'data': {'text': f'Кажется, произошла ошибка при попытке удалить эту задачу. Думаю, это судьба и стоит оставить ее.', 'buttons': False, 'secret': None}}
                    
                    return {'result': 'success', 'data': {'text': f'Задача "{action["task"]}" удалена из проекта "{action["target_project"]}"', 'buttons': False, 'secret': None}}
                elif action['type'] == 'check_task':
                    return {'result': 'success', 'data': {'text': f'Задача "{action["task"]}" отмечена как выполненная в проекте "{action["target_project"]}"', 'buttons': False, 'secret': None}}
                
            else:
                return {'result': 'error', 'data': {'text': f'$ токен {secret} не найден в базе данных', 'buttons': False, 'secret': None}}
        
    except Exception as e:
        logger.error(f"Error processing user answer: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/figma_check")
def figma_check(figma_data: FigmaData) -> dict:
    try:
        project_name = figma_data.project_name
        figma_token = figma_data.figma_token
        figma_file_key = figma_data.figma_file_key

        res = figma_load(figma_file_key, figma_token, project_name)
        if 'error' in res:
            logger.error(f"Error loading Figma data: {res['error']}")
            raise HTTPException(status_code=400, detail=res['error'])
        logger.info("Figma data loading successful")
        res = figma_compare(project_name)
        logger.info(f"Figma comparison result: {res}")

        return {'result': 'success'} | res
        
    except Exception as e:
        logger.error(f"Error loading Figma data: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    try:
        openapi_schema = get_openapi(
            title="shmyaks task api",
            version="1.0.0",
            description="",
            routes=app.routes,
        )
        app.openapi_schema = openapi_schema
        return app.openapi_schema
    except Exception as e:
        logger.error(f"Error generating OpenAPI schema: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

app.openapi = custom_openapi

def _format(text: str) -> str:
    logger.info(f"Formatting text: {text}")
    formatted_ = text.replace('\'', '').replace('\n', '').replace('`', '')
    logger.info(f"Formatted text: {formatted_}")
    return formatted_

def get_project_id_by_name(data, input_name):
    for project in data['projects']:
        if project['name'] == input_name:
            return project['id']
    return None

def check_answer_valid(text):
    if '{' in text and '}' in text:
        if text.count('{') == text.count('}'):
            if len(text.split('{')) < 5 and len(text.split('}')) < 5:
                return True
    return False