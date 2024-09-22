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

        diff = DeepDiff(project_data[0], project_data[1], ignore_order=True)
        
        data_rescue = project_data[-1]
        clear_project_data(project_name)
        add_project_data(project_name, data_rescue)
        
        try:
            data_ = {}
            frames_ = find_frames(project_data[1]['document'], "root['document']")
            if 'iterable_item_added' in diff:
                data_['new_frames'] = []
                data_['new_items'] = []
                for item in diff['iterable_item_added']:
                    if diff['iterable_item_added'][item]['type'] == 'FRAME':
                        data_['new_frames'].append({'name': diff['iterable_item_added'][item]['name'], 'path': item})       
                    else:
                        path_ = re.sub(r"\['children'\]\[\d+\]$", '', item)
                        data_['new_items'].append({
                            'name': diff['iterable_item_added'][item]['name'], 
                            'path': item,
                            'type': diff['iterable_item_added'][item]['type'],
                            'frame': [frame for frame in frames_ if frame['path'] == path_][0]
                        })
            if 'values_changed' in diff:
                data_['changed_items'] = []
                for item in diff['values_changed']:
                    if "root['document']" in item:
                        path_ = extract_common_path(item)
                        
                        if not any([item['path'] == path_ for item in data_['changed_items']]):
                            data_['changed_items'].append({
                                'name': access_by_path(project_data[1], path_.replace('root', ''))['name'], 
                                'path': path_,
                                'type': access_by_path(project_data[1], path_.replace('root', ''))['type'],
                                'frame': [frame for frame in frames_ if frame['path'] == re.sub(r"\['children'\]\[\d+\]$", '', path_)][0],
                                'frame_path': re.sub(r"\['children'\]\[\d+\]$", '', path_)
                            })
            if 'iterable_item_removed' in diff:
                data_['removed_items'] = []
                for item in diff['iterable_item_removed']:
                    if diff['iterable_item_removed'][item]['type'] == 'FRAME':
                        data_['removed_items'].append({'name': diff['iterable_item_removed'][item]['name'], 'path': item})
                    else:
                        path_ = re.sub(r"\['children'\]\[\d+\]$", '', item)
                        data_['removed_items'].append({
                            'name': diff['iterable_item_removed'][item]['name'], 
                            'path': item,
                            'type': diff['iterable_item_removed'][item]['type'],
                            'frame': [frame for frame in frames_ if frame['path'] == path_][0]
                        })

            return {'difference': diff, 'data': data_}

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
    if path.startswith('root'):
        path = path.replace('root', '', 1)

    keys = re.findall(r"\['([^']*)'\]|\[(\d+)\]", path)
    
    for key in keys:
        if key[0]:
            data = data[key[0]]
        elif key[1]:
            data = data[int(key[1])]

    return data