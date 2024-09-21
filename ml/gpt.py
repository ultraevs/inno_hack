import requests
import os
import json


class GPT:
    def __init__(self):
        #self.YC = os.getenv('YC_TOKEN')
        self.YC = 't1.9euelZqSlpLLlsyLipOPzo6JjJOXj-3rnpWaisjJxsyJy5LLkM2byovJzs7l8_dQBkVI-e8GUBER_d3z9xA1Qkj57wZQERH9zef1656VmpWLlMmUk8_Gm5rGk8mWj5Ce7_zF656VmpWLlMmUk8_Gm5rGk8mWj5Ce.WHSmxFZRhEx6GlB9HIx0Q6rK0-nLnGtIUy99WlmWXkM8mdlxH-ENNYMaEhRl1v_Rqu8C2KD3sDZ4xDfmzfsCDg'
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


        return {'status': 'success', 'result': response.json()['result']['alternatives'][0]['message']['text']}
