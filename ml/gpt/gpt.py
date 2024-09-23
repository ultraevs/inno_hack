import requests
import os
import json


class GPT:
    def __init__(self):
        #self.YC = os.getenv('YC_TOKEN')
        self.YC = 't1.9euelZqSlJfPzs6VjJqQzczHz8-Lke3rnpWaisjJxsyJy5LLkM2byovJzs7l8_dkSjpI-e8LTnlc_t3z9yR5N0j57wtOeVz-zef1656VmpSQnpKNlYvJnJjKls7MiYyS7_zF656VmpSQnpKNlYvJnJjKls7MiYyS.3CrUsPVwjfz02ve4JHwRZ9UHEF75JXTzFcioGUqEkAYohjtos_Zex3bvGaNzBOe8KG7tcJh9-lYszhpvd1MWCw'
        self.folder = 'b1gchek74cd5e8aadsp6'
        self.url = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion'

    def generate(self, prompt):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.YC}",
            "X-folder-id": self.folder
        }

        data = {
            "modelUri": f"gpt://{self.folder}/yandexgpt-lite",
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

        if 'error' in response.json():
            return {'status': 'failed', 'result': response.json()['error']['message']}


        return {'status': 'success', 'result': response.json()['result']['alternatives'][0]['message']['text']}
