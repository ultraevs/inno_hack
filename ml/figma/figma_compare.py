import logging
from ml.db.database import get_project_data, add_project_data, clear_project_data
import json
from deepdiff import DeepDiff
import re
import traceback

logging.basicConfig(filename='figma_compare.log', level=logging.ERROR,
                    format='%(asctime)s:%(levelname)s:%(message)s')

def figma_compare(project_name):
    try:
        project_data = get_project_data(project_name)

        if len(project_data) == 1:
            return {'error': 'not enough data [+1 required]'}

        diff = DeepDiff(project_data[0], project_data[1], ignore_order=True)
        

        data_rescue = project_data
        clear_project_data(project_name)
        add_project_data(project_name, data_rescue[-1])
        
        try:
            data_ = {}
            data_['changes'] = {}
            frames_ = find_frames(project_data[1]['document'], "root['document']")
            if 'iterable_item_added' in diff:
                data_['changes']['new_frames'] = []
                data_['changes']['new_items'] = []
                for item in diff['iterable_item_added']:
                    if diff['iterable_item_added'][item]['type'] == 'FRAME':
                        data_['changes']['new_frames'].append({'name': diff['iterable_item_added'][item]['name'], 'path': item})       
                    else:
                        path_ = re.sub(r"\['children'\]\[\d+\]$", '', item)
                        data_['changes']['new_items'].append({
                            'name': diff['iterable_item_added'][item]['name'], 
                            'path': item,
                            'type': diff['iterable_item_added'][item]['type'],
                            'frame': [frame for frame in frames_ if frame['path'] == path_][0]
                        })
            if 'values_changed' in diff:
                data_['changes']['changed_items'] = []
                for item in diff['values_changed']:
                    if "root['document']" in item:
                        path_ = extract_common_path(item)
                        
                        if not any([item['path'] == path_ for item in data_['changes']['changed_items']]):
                            data_['changes']['changed_items'].append({
                                'name': access_by_path(project_data[1], path_.replace('root', ''))['name'], 
                                'path': path_,
                                'type': access_by_path(project_data[1], path_.replace('root', ''))['type'],
                                'frame': [frame for frame in frames_ if frame['path'] == re.sub(r"\['children'\]\[\d+\]$", '', path_)][0],
                                'frame_path': re.sub(r"\['children'\]\[\d+\]$", '', path_)
                            })
            if 'iterable_item_removed' in diff:
                data_['changes']['removed_items'] = []
                for item in diff['iterable_item_removed']:
                    if diff['iterable_item_removed'][item]['type'] == 'FRAME':
                        data_['changes']['removed_items'].append({'name': diff['iterable_item_removed'][item]['name'], 'path': item})
                    else:
                        path_ = re.sub(r"\['children'\]\[\d+\]$", '', item)
                        data_['changes']['removed_items'].append({
                            'name': diff['iterable_item_removed'][item]['name'], 
                            'path': item,
                            'type': diff['iterable_item_removed'][item]['type'],
                            'frame': [frame for frame in frames_ if frame['path'] == path_][0]
                        })
            data_['ext'] = {}
            data_['ext']['new_frames'] = len(data_['changes']['new_frames']) if 'new_frames' in data_['changes'] else 0
            data_['ext']['changed_items'] = len(data_['changes']['changed_items']) if 'changed_items' in data_['changes'] else 0
            data_['ext']['removed_items'] = len(data_['changes']['removed_items']) if 'removed_items' in data_['changes'] else 0
            data_['ext']['new_items'] = len(data_['changes']['new_items']) if 'new_items' in data_['changes'] else 0


            if (
                ('new_frames' in data_['changes'] and len(data_['changes']['new_frames']) > 0) or
                ('changed_items' in data_['changes'] and len(data_['changes']['changed_items']) > 5) or
                ('removed_items' in data_['changes'] and len(data_['changes']['removed_items']) > 3) or
                ('new_items' in data_['changes'] and len(data_['changes']['new_items']) > 2)
            ):
                data_['message'] = 'Significant changes detected'
                return {'data': data_}
            else:
                clear_project_data(project_name)
                add_project_data(project_name, data_rescue[0])
                return {'data': {'message': 'No significant changes'} | data_}
            

        except Exception as e:
            print(traceback.format_exc())

    except Exception as e:
        logging.error(f"Error in figma_compare for project {project_name}: {e}")
        return {'error': str(e)}
    

def find_frames(node, current_path):
    frames = []
    if 'children' in node:
        for i, child in enumerate(node['children']):
            new_path = f"{current_path}['children'][{i}]"
            if child.get('type') == 'FRAME':
                frames.append({'path': new_path, 'name': child.get('name')})
            frames.extend(find_frames(child, new_path))
    return frames

def extract_common_path(path: str) -> str:
    pattern = re.compile(r"(?:\['children'\]\[\d+\])")
    match = pattern.findall(path)
    common_path = "root['document']" + ''.join(match)
    return common_path

def access_by_path(data, path):
    try:
        if path.startswith('root'):
            path = path.replace('root', '', 1)

        keys = re.findall(r"\['([^']*)'\]|\[(\d+)\]", path)
        
        for key in keys:
            if key[0]:
                data = data[key[0]]
            elif key[1]:
                data = data[int(key[1])]

        return data
    except: return 'unknown'