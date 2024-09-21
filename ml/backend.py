import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.responses import FileResponse
from gpt import GPT
from prompts import prompts


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TaskData(BaseModel):
    description: str
    tasks: List[str]

_gpt = GPT()
app = FastAPI()

@app.get("/", response_class=FileResponse)
async def root():
    logger.info("Serving root.html")
    return FileResponse("root.html")

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