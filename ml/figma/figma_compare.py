import logging
from ml.db.database import get_project_data, add_project_data, clear_project_data
import json
from deepdiff import DeepDiff

logging.basicConfig(filename='figma_compare.log', level=logging.ERROR,
                    format='%(asctime)s:%(levelname)s:%(message)s')

def figma_compare(project_name):
    try:
        project_data = get_project_data(project_name)
        
        print(len(project_data))

        diff = DeepDiff(project_data[0], project_data[1], ignore_order=True)
        
        data_rescue = project_data[-1]
        clear_project_data(project_name)
        add_project_data(project_name, data_rescue)
        return {'difference': diff}
    except Exception as e:
        logging.error(f"Error in figma_compare for project {project_name}: {e}")
        return {'error': str(e)}