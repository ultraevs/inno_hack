import requests
import os
import json
import subprocess
import time
from dotenv import load_dotenv
import logging

logger = logging.getLogger('project_logger')

load_dotenv()

class GPT:
    def __init__(self):
        self.YC_JWT             = os.getenv('YC_JWT')
        self.folder             = os.getenv('YC_folder')

        self.IAM = None

        self.generate_iam()

        self.url                = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
        self.classification_url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/fewShotTextClassification'

    def generate(self, prompt, maxTokens=30):
        logger.info('> generate')

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.IAM}",
            "X-folder-id": self.folder
        }

        data = {
            "modelUri": f"gpt://{self.folder}/yandexgpt/latest",
            "completionOptions": {
                "stream": False,
                "temperature": 0.5,
                "maxTokens": maxTokens
            },
            "messages": [
                {
                    "role": "user",
                    "text": prompt
                }
            ]
        }

        attempts = 0
        while attempts < 3:
            response = requests.post(self.url, headers=headers, data=json.dumps(data))
            result = self.check_result(response)
            if 'error' not in result:
                break
            attempts += 1
            time.sleep(0.5)

        if attempts == 3:
            return {'error': 'ai cannot be processed: ' + result}
        
        return {'status': 'success', 'result': response.json()['result']['alternatives'][0]['message']['text']}
        
    
    def classify(self, text):
        logger.info('> classify')
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.IAM}",
            "X-folder-id": self.folder
        }

        data = {
            "modelUri": f"cls://{self.folder}/yandexgpt/latest",
            "taskDescription": 'Определи категорию задачи по тексту от пользователя',
            "labels": ['добавить задачу', 'удалить задачу', 'отметить задачу выполненной', 'пригласить человека', 'удалить человека', 'другое'],
            "text": text
        }


        attempts = 0
        while attempts < 3:
            response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))
            result = self.check_result(response)
            if 'error' not in result:
                break
            attempts += 1
            time.sleep(0.5)

        if attempts == 3:
            return {'error': 'ai cannot be processed: ' + result}
        
        return {'status': 'success', 'result': max(response.json()['predictions'], key=lambda x: x['confidence'])['label']}
    
    def compare_projects(self, A, B):
        logger.info('> compare_projects')
        B.append('other')

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.IAM}",
            "X-folder-id": self.folder
        }

        data = {
            "modelUri": f"cls://{self.folder}/yandexgpt/latest",
            "taskDescription": 'Сопоставь данное название проекта с наиболее близким названием проекта из предоставленных. В случае, если наиболее близкое название проекта не представлено, выбери "other".',
            "labels": B,
            "text": A
        }
        

        attempts = 0
        while attempts < 3:
            response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))
            result = self.check_result(response)
            if 'error' not in result:
                break
            attempts += 1
            time.sleep(0.5)

        if attempts == 3:
            return {'error': 'ai cannot be processed: ' + result}
        
        return {'status': 'success', 'result': max(response.json()['predictions'], key=lambda x: x['confidence'])['label']}
    
    def compare_role_task(self, A, B):
        logger.info('> compare_role_task')
        B.remove('owner')
        headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.IAM}",
                "X-folder-id": self.folder
            }

        data = {
            "modelUri": f"cls://{self.folder}/yandexgpt/latest",
            "taskDescription": 'Подбери самую подходящую роль для задачи в проекте',
            "labels": B,
            "text": 'Задача: ' + A
        }
        

        
        attempts = 0
        while attempts < 3:
            response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))
            result = self.check_result(response)
            if 'error' not in result:
                break
            attempts += 1
            time.sleep(0.5)

        if attempts == 3:
            return {'error': 'ai cannot be processed: ' + result}
        
        return {'status': 'success', 'result': max(response.json()['predictions'], key=lambda x: x['confidence'])['label']}
    
    def find_similar_role(self, A, B=None):
        logger.info('> find_similar_role')
        headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.IAM}",
                "X-folder-id": self.folder
            }

        data = {
            "modelUri": f"cls://{self.folder}/yandexgpt/latest",
            "taskDescription": 'Подбери самую ближайшую по смыслу роль на основе предоставленной.',
            "labels": [
                    "Project Manager",
                    "Machine Learning",
                    "Computer Vision",
                    "Frontend",
                    "Backend",
                    "Dev-Ops",
                    "Designer",
                    "Full-Stack"
                    ],
            "text": 'Роль: ' + A
        }

        attempts = 0
        while attempts < 3:
            response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))
            result = self.check_result(response)
            if 'error' not in result:
                break
            attempts += 1
            time.sleep(0.5)

        if attempts == 3:
            return {'error': 'ai cannot be processed: ' + result}
        
        return {'status': 'success', 'result': max(response.json()['predictions'], key=lambda x: x['confidence'])['label']}
    
    def check_json_valid(self, text):
        logger.info('> check_json_valid')
        headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.IAM}",
                "X-folder-id": self.folder
            }

        data = {
            "modelUri": f"cls://{self.folder}/yandexgpt/latest",
            "taskDescription": 'Проверь, является ли переданная строка ЧИСТЫМ JSON. В случае, если вне JSON объекта есть текст - это грязный JSON.',
            "labels": [
                    "чистый JSON",
                    "грязный JSON"
                    ],
            "text": text
        }

        attempts = 0
        while attempts < 3:
            response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))
            result = self.check_result(response)
            if 'error' not in result:
                break
            attempts += 1
            time.sleep(0.5)

        if attempts == 3:
            return {'error': 'ai cannot be processed: ' + result}
        print(text)
        print(response.json())
        
        return {'status': 'success', 'result': max(response.json()['predictions'], key=lambda x: x['confidence'])['label']}
    

    def generate_iam(self):
        logger.info('generating iam...')
        response = requests.post(
            'https://iam.api.cloud.yandex.net/iam/v1/tokens',
            json={"jwt": self.YC_JWT}
        )

        if 'is invalid' in response.text or 'was not found' in response.text:
            self.IAM = None
            logger.error(f'JWT is invalid: {self.IAM}')
            return
        
        if 'JWT already expired' in response.text:
            logger.error(f'JWT already expired: {self.IAM}')
            self.IAM = None
            return

        self.IAM = response.json()['iamToken']
        logger.info(f'IAM generated')

    def check_result(self, data_):
        if 'token is invalid' in data_.text:
            self.generate_iam()
            return {'error': 'token'}
        if 'error' in data_.text:
            return {'error': 'request error'}
        
        return {'success': 'success'}
    
    