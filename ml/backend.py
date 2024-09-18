from fastapi import FastAPI
from pydantic import BaseModel
from typing import List


from gpt import GPT
from prompts import prompts

app = FastAPI()


class TaskData(BaseModel):
    description: str
    tasks: List[str]

_gpt = GPT()

@app.post("/process_tasks/")
def process_tasks(task_data: TaskData):
    project_description = task_data.description,
    project_tasks = task_data.tasks

    response = _gpt.generate(prompts['tasks_gen'].format(project_description=project_description, project_tasks=project_tasks))

    return {'status': 'success', 'response': response}