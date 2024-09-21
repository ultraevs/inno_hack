import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.responses import FileResponse
from fastapi.openapi.utils import get_openapi
from ml.gpt.gpt import GPT
from ml.gpt.prompts import prompts
from ml.figma.figma_compare import figma_compare
from ml.figma.figma_loader import figma_load

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TaskData(BaseModel):
    description: str
    tasks: List[str]

class FigmaData(BaseModel):
    project_name: str
    figma_token: str
    figma_file_key: str

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
        return FileResponse("root.html")
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

        return {'result': 'success', 'difference': res['difference']}
        
    except Exception as e:
        logger.error(f"Error loading Figma data: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    try:
        openapi_schema = get_openapi(
            title="My Project API",
            version="1.0.0",
            description="This is an API for managing projects and generating tasks using GPT.",
            routes=app.routes,
        )
        app.openapi_schema = openapi_schema
        return app.openapi_schema
    except Exception as e:
        logger.error(f"Error generating OpenAPI schema: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

app.openapi = custom_openapi