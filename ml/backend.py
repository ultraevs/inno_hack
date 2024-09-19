from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import FileResponse
from typing import List


from gpt import GPT
from prompts import prompts

app = FastAPI()


class TaskData(BaseModel):
    description: str
    tasks: List[str]

_gpt = GPT()

@app.get("/", response_class=FileResponse)
async def root():
    return FileResponse("root.html")

@app.post("/generate_tasks")
def process_tasks(task_data: TaskData) -> dict:
    project_description = task_data.description,
    project_tasks = task_data.tasks


    response = _gpt.generate(prompts['tasks_gen'].format(project_description=project_description, project_tasks=', '.join(project_tasks)))
    response['result'] = response['result'].replace('* ', '').split('\n')
    return response