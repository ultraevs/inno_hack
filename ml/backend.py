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
import time
import requests


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)

logger.addHandler(console_handler)

class TaskData(BaseModel):
    description: str
    tasks: List[str]

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

_gpt = GPT()
app = FastAPI(
    title="My Project API",
    description="This is an API for managing projects and generating tasks using GPT.",
    version="1.0.0",
    docs_url="/swagger",
    redoc_url="/redoc"
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

        logger.info(f"Received task data: description={project_description}, tasks={project_tasks}")

        response = _gpt.generate(prompts['tasks_gen'].format(project_description=project_description, project_tasks=', '.join(project_tasks)))
        response['result'] = response['result'].replace('* ', '').split('\n')
        
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
            answer = prompts['default_answer']
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

                formatted_action = json.loads(_format(action))

                backup_project = formatted_action['target_project']
                formatted_action['target_project'] = _gpt.compare(formatted_action['target_project'], user_projects)['result']
                logger.info(f"Formatted action: {formatted_action}")

                if formatted_action['target_project'] == 'other':
                    return {'result': 'error', 'data': {'text': f'К сожалению, мне не удалось найти проект "{backup_project}" или у Вас нет к нему доступа.', 'buttons': False, 'secret': None}}

                answer = prompts['add_task_answer'].format(project=formatted_action['target_project'], task=formatted_action['task'])
                logger.info(f"Answer: {answer}")
                set_token_data(secret, json.dumps(formatted_action))

            elif formatted_type_ == 'invite_team':
                action = _gpt.generate(prompts['invite_team'].format(user_text=user_text))['result']
                formatted_action = json.loads(_format(action))
                answer = prompts['invite_team_answer'].format(project=formatted_action['target_project'], user=formatted_action['nickname'])
                set_token_data(secret, json.dumps(formatted_action))
            
            elif formatted_type_ == 'kick_team':
                action = _gpt.generate(prompts['kick_team'].format(user_text=user_text))['result']
                formatted_action = json.loads(_format(action))
                answer = prompts['kick_team_answer'].format(project=formatted_action['target_project'], user=formatted_action['nickname'])
                set_token_data(secret, json.dumps(formatted_action))
            
            elif formatted_type_ == 'delete_task':
                action = _gpt.generate(prompts['delete_task'].format(user_text=user_text))['result']
                formatted_action = json.loads(_format(action))
                answer = prompts['delete_task_answer'].format(project=formatted_action['target_project'], task=formatted_action['task'])
                set_token_data(secret, json.dumps(formatted_action))
            
            elif formatted_type_ == 'check_task':
                action = _gpt.generate(prompts['check_task'].format(user_text=user_text))['result']
                formatted_action = json.loads(_format(action))
                answer = prompts['check_task_answer'].format(project=formatted_action['target_project'], task=formatted_action['task'])
                set_token_data(secret, json.dumps(formatted_action))

        

        return {'result': 'success', 'data': {'text': answer, 'buttons': buttons, 'secret': secret}}
    except Exception as e:
        logger.error(f"Error processing AI helper: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/user_answer")
def process_user_answer(user_answer: UserAnswer) -> dict:
    try:
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

                    return {'result': 'success', 'data': {'text': f'Задача "{action["task"]}" добавлена в проект "{action["target_project"]}"', 'buttons': False, 'secret': None}}
                elif action['type'] == 'invite_team':
                    return {'result': 'success', 'data': {'text': f'Пользователь "{action["nickname"]}" добавлен в проект "{action["target_project"]}"', 'buttons': False, 'secret': None}}
                elif action['type'] == 'kick_team':
                    return {'result': 'success', 'data': {'text': f'Пользователь "{action["nickname"]}" удалён из проекта "{action["target_project"]}"', 'buttons': False, 'secret': None}}
                elif action['type'] == 'delete_task':
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