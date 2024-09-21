import requests


url = 'http://127.0.0.1:8000'



#       generate new tasks
description = 'Онлайн-магазин продажи бытовой техники с бесплатной доставкой' 
tasks = ['личный кабинет', 'бонусная и реферальные системы', 'система доставки', 'вебсайт'] # current tasks that team members are working on / have done

r = requests.post(f'{url}/generate_tasks', json={'description': description, 'tasks': tasks})
print(r.json())