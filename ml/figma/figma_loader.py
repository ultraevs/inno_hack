import requests
import json
import logging
from ml.db.database import create_project, add_project_data, get_all_project_names, get_project_data

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_figma_project_data(file_key, token):
    logger.info(f'Fetching Figma project data for file_key: {file_key}')
    url = f'https://api.figma.com/v1/files/{file_key}'
    headers = {
        'X-Figma-Token': token
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        logger.error(f'Error fetching Figma project data: {e}')
        return None

def figma_load(file_key, token, project_name):
    logger.info(f'Loading Figma project data for project: {project_name}')
    try:
        if project_name not in get_all_project_names():
            create_project(project_name)
        
        project_data = get_figma_project_data(file_key, token)
        if project_data is None:
            return {'error': 'Failed to fetch project data'}
        
        if get_project_data(project_name) == 0:
            add_project_data(project_name, project_data)
            return {'error': 'not enough data [+1 required]'}
        else:
            add_project_data(project_name, project_data)
            return {'success': f'data loaded [{len(get_project_data(project_name))}]'}
    except Exception as e:
        logger.error(f'Error loading Figma project data: {e}')
        return {'error': 'An error occurred while loading project data'}