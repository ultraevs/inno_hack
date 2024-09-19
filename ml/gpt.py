import requests
import os
import json


class GPT:
    def __init__(self):
        #self.YC = os.getenv('YC_TOKEN')
        self.YC = 't1.9euelZrOl5iRlsnMlIyOkpyVkcyTku3rnpWaisjJxsyJy5LLkM2byovJzs7l9PcMD09I-e8qc3q93fT3TD1MSPnvKnN6vc3n9euelZrMzZaQjYrPlJ6OmMzMi8-Ny-_8xeuelZrMzZaQjYrPlJ6OmMzMi8-Nyw.xPlK8N5ViCvqeZ7yFuF4w0Yr_agnUfhkAXmzMxXAy_3lQ9JMvnHBlSwjgXS5bnUSJbl5W86VWLX2nCn1r324Cw'
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
                "temperature": 0.6,
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

        print({'status': 'success', 'result': response.json()['result']['alternatives'][0]['message']['text']})

        return {'status': 'success', 'result': response.json()['result']['alternatives'][0]['message']['text']}