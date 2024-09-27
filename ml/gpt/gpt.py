import requests
import os
import json
import subprocess
import time
from dotenv import load_dotenv

load_dotenv()

class GPT:
    def __init__(self):
        self.YC_JWT             = os.getenv('YC_JWT')
        self.folder             = os.getenv('YC_folder')

        self.generate_iam()

        self.url                = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'
        self.classification_url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/fewShotTextClassification'

    def generate(self, prompt):
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
                "maxTokens": 2000
            },
            "messages": [
                {
                    "role": "user",
                    "text": prompt
                }
            ]
        }

        response = requests.post(self.url, headers=headers, data=json.dumps(data))

        while 'ai.textGenerationCompletionSessionsCount.count' in response.text:
            time.sleep(0.5)
            response = requests.post(self.url, headers=headers, data=json.dumps(data))
        
        data_ = response.json()['result']['alternatives'][0]['message']['text']

        if 'token is invalid' in response.text:
            self.generate_iam()
            return {'status': 'error', 'message': 'Token is invalid'}
        return {'status': 'success', 'result': data_}
    
    def classify(self, text):
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

        response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))

        data_ = response.json()

        print(data_)
        
        if 'token is invalid' in response.text:
            self.generate_iam()
            return {'status': 'error', 'message': 'Token is invalid'}
        return {'status': 'success', 'result': max(data_['predictions'], key=lambda x: x['confidence'])['label']}
    
    def compare_projects(self, A, B):
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
        
        print(A, B)

        response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))

        while 'ai.textGenerationCompletionSessionsCount.count' in response.text or 'ai.textClassificationClassifyRequestsPerSecond.rate' in response.text:
            time.sleep(0.5)
            response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))
        
        data_ = response.json()
        
        if 'token is invalid' in response.text:
            self.generate_iam()
            return {'status': 'error', 'message': 'Token is invalid'}
        return {'status': 'success', 'result': max(data_['predictions'], key=lambda x: x['confidence'])['label']}
    
    def compare_role_task(self, A, B):
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
        

        
        while True:
            response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))
            if 'error' not in response.text:
                break
            time.sleep(0.5)
        
        data_ = response.json()

        if 'token is invalid' in response.text:
            self.generate_iam()
            return {'status': 'error', 'message': 'Token is invalid'}
        return {'status': 'success', 'result': max(data_['predictions'], key=lambda x: x['confidence'])['label']}
    
    def find_similar_role(self, A, B=None):
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
        
        while True:
            response = requests.post(self.classification_url, headers=headers, data=json.dumps(data))
            if 'error' not in response.text:
                break
            time.sleep(0.5)
        
        data_ = response.json()

        if 'token is invalid' in response.text:
            self.generate_iam()
            return {'status': 'error', 'message': 'Token is invalid'}
        return {'status': 'success', 'result': max(data_['predictions'], key=lambda x: x['confidence'])['label']}
    

    def generate_iam(self):
        response = requests.post(
            'https://iam.api.cloud.yandex.net/iam/v1/tokens',
            json={"jwt": self.YC_JWT}
        )

        if 'is invalid' in response.text or 'was not found' in response.text:
            self.IAM = None
            return

        self.IAM = response.json()['iamToken']
        print('token - ' + self.IAM)