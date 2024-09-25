prompts = {
    'tasks_gen': 'На основе текущего описания проекта и списка задач необходимо предложить новые идеи и задачи, которые могут органично вписаться в проект и дополнить существующий функционал. Твои предложения должны учитывать цели и специфику проекта, а также улучшать пользовательский опыт. Новые задачи должны быть реалистичными и полезными, не дублировать существующие и быть лаконично описанными. Описание проекта: {project_description}. Текущие задачи проекта: {project_tasks} Инструкция: Изучи описание проекта и существующие задачи. Сгенерируй несколько новых предложений по задачам, которые могли бы органично дополнить проект. Предложения должны быть краткими и реалистичными, они должны логично расширять функционал проекта. Задачи должны быть полезными для улучшения текущего функционала или увеличения взаимодействия с пользователями. Верни задачи в формате списка построчно. Делай их короткими и информативными. Не пиши лишнего текста, исключительно список. Не включай в ответ заголовок списка, только его содержание.',


    'default_answer': 'Привет, я - нейросеть, которая может помочь тебе с действиями на сайте, например: создать задачу или пригласить человека в команду. Попробуй задать мне вопрос или дать команду, и я постараюсь помочь тебе. Например, "Добавь задачу: разработать интерфейс для сайта".',
    'add_task_answer': 'Добавить задачу "{task}" в проект "{project}"?',
    'invite_team_answer': 'Добавить пользователя "{user}" в проект "{project}"?',
    'kick_team_answer': 'Удалить пользователя "{user}" из проекта "{project}"?',
    'delete_task_answer': 'Удалить задачу "{task}" из проекта "{project}"?',
    'check_task_answer': 'Отметить задачу "{task}" в проекте "{project}" как выполненную?',

    'classify_task': """
Проанализируй текст: {user_text}

Определи, соответствует ли текст одному из следующих типов:

- add_task - добавить задачу
- invite_team - добавить в команду
- kick_team - выгнать из команды
- delete_task - удалить задачу
- check_task - отметить задачу выполненной

Выведи **только** следующий JSON без каких-либо дополнительных пояснений, текста или форматирования:

{{"type":"[определенный тип]"}}

Где:

- [определенный тип] — одно из значений: "add_task", "invite_team", "kick_team", "delete_task", "check_task", **"other"**

**Важно:**

- Если текст **четко** соответствует одному из типов, выведи соответствующий JSON.
- Если текст **не соответствует** ни одному из типов, выведи JSON {{\"type\":\"other\"}} без дополнительных символов.
- Не добавляй никаких дополнительных символов, текста или форматирования (например, не используй кодовые блоки или кавычки).
- Выведи **только** чистый JSON.

**Примеры запросов и ожидаемые выводы:**

1. **Запрос:**

"Добавь новую задачу 'Сделать бэкап данных' в проект."

**Ожидаемый вывод:**

{{"type":"add_task"}}

2. **Запрос:**

"Пригласи Анну в нашу команду."

**Ожидаемый вывод:**

{{"type":"invite_team"}}

3. **Запрос:**

"Удалить Ивана из команды."

**Ожидаемый вывод:**

{{"type":"kick_team"}}

4. **Запрос:**

"Пожалуйста, удали задачу 'Обновить сайт'."

**Ожидаемый вывод:**

{{"type":"delete_task"}}

5. **Запрос:**

"Отметь задачу 'Написать отчёт' как выполненную."

**Ожидаемый вывод:**

{{"type":"check_task"}}

6. **Запрос:**

"Привет, как дела?"

**Ожидаемый вывод:**

{{"type":"other"}}

""", 
    'add_task': """
Проанализируй текст: {user_text}

Если пользователь просит создать задачу в проекте, выведи **только** следующий JSON без каких-либо дополнительных пояснений, текста или форматирования:

{{"type":"add_task","target_project":"[название проекта]","task":"[описание задачи]"}}

Где:

- [название проекта] — название проекта из текста пользователя, без кавычек и дополнительных символов.
- [описание задачи] — описание задачи из текста пользователя, без названия проекта и без кавычек.

**Важно:**

- Не добавляй никаких дополнительных символов, текста или форматирования (например, не используй кодовые блоки или кавычки).
- Выведи **только** чистый JSON.
- Если текст не содержит запроса на создание задачи, выведи JSON {{}} без дополнительных символов.

Примеры:
1. "Создай задачу разработать фронтенд для проекта СуперПриложение."
результат: {{"type":"add_task","target_project":"СуперПриложение","task":"разработать фронтенд"}}

2. "добавь задачу Сверстать фронтенд в Notion"
результат: {{"type":"add_task","target_project":"Notion","task":"Сверстать фронтенд"}}
""",
    'invite_team': """
Проанализируй текст: {user_text}

Если пользователь просит добавить другого пользователя в команду проекта, выведи **только** следующий JSON без каких-либо дополнительных пояснений, текста или форматирования:

{{"type":"invite_team","target_project":"[название проекта]","nickname":"[никнейм пользователя]"}}

Где:

- [название проекта] — название проекта из текста пользователя, без кавычек и дополнительных символов.
- [никнейм пользователя] — никнейм пользователя, которого нужно добавить, без кавычек и дополнительных символов.

**Важно:**

- Не добавляй никаких дополнительных символов, текста или форматирования (например, не используй кодовые блоки или кавычки).
- Выведи **только** чистый JSON.
- Если текст не содержит запроса на добавление пользователя в проект, выведи JSON {{}} без дополнительных символов.

**Пример запроса для теста:**

"Добавь cocucku13 в проект Шмякс"

**Ожидаемый вывод:**

{{"type":"invite_team","target_project":"Шмякс","nickname":"cocucku13"}}
""",
    'kick_team': """
Проанализируй текст: {user_text}

Если пользователь просит удалить другого пользователя из команды проекта, выведи **только** следующий JSON без каких-либо дополнительных пояснений, текста или форматирования:

{{"type":"kick_team","target_project":"[название проекта]","nickname":"[никнейм пользователя]"}}

Где:

- [название проекта] — название проекта из текста пользователя, без кавычек и дополнительных символов.
- [никнейм пользователя] — никнейм пользователя, которого нужно удалить, без кавычек и дополнительных символов.

**Важно:**

- Не добавляй никаких дополнительных символов, текста или форматирования (например, не используй кодовые блоки или кавычки).
- Выведи **только** чистый JSON.
- Если текст не содержит запроса на удаление пользователя из проекта, выведи JSON {{}} без дополнительных символов.

**Пример запроса для теста:**

"Удалить cocucku13 из проекта Шмякс"

**Ожидаемый вывод:**

{{"type":"kick_team","target_project":"Шмякс","nickname":"cocucku13"}}
""",
    'delete_task': """
Проанализируй текст: {user_text}

Если пользователь просит удалить задачу из проекта, выведи **только** следующий JSON без каких-либо дополнительных пояснений, текста или форматирования:

{{"type":"delete_task","target_project":"[название проекта]","task":"[название задачи]"}}

Где:

- [название проекта] — название проекта из текста пользователя, без кавычек и дополнительных символов.
- [название задачи] — название задачи из текста пользователя, которую нужно удалить, без кавычек и дополнительных символов.

**Важно:**

- Не добавляй никаких дополнительных символов, текста или форматирования (например, не используй кодовые блоки или кавычки).
- Выведи **только** чистый JSON.
- Если текст не содержит запроса на удаление задачи, выведи JSON {{}} без дополнительных символов.

**Пример запроса для теста:**

"Удалить задачу 'Обновить дизайн' из проекта СуперСайт"

**Ожидаемый вывод:**

{{"type":"delete_task","target_project":"СуперСайт","task":"Обновить дизайн"}}
""",
    'check_task': """
Проанализируй текст: {user_text}

Если пользователь просит отметить задачу как выполненную в проекте, выведи **только** следующий JSON без каких-либо дополнительных пояснений, текста или форматирования:

{{"type":"check_task","target_project":"[название проекта]","task":"[название задачи]"}}

Где:

- [название проекта] — название проекта из текста пользователя, без кавычек и дополнительных символов.
- [название задачи] — название задачи из текста пользователя, которую нужно отметить как выполненную, без кавычек и дополнительных символов.

**Важно:**

- Не добавляй никаких дополнительных символов, текста или форматирования (например, не используй кодовые блоки или кавычки).
- Выведи **только** чистый JSON.
- Если текст не содержит запроса на отметку задачи как выполненной, выведи JSON {{}} без дополнительных символов.

**Пример запроса для теста:**

"Отметь задачу 'Написать отчёт' как выполненной в проекте БизнесАналитика"

**Ожидаемый вывод:**

{{"type":"check_task","target_project":"БизнесАналитика","task":"Написать отчёт"}}
""",
    'compare': """
Сравни строку: {A}

С каждым из следующих вариантов:

{B}

Найди строку из списка, которая наиболее похожа или близка по смыслу к заданной строке.

**Критерии сходства:**

- Строки считаются достаточно похожими, если они имеют одинаковое или очень похожее написание.
- Если строки имеют разное написание и не связаны по смыслу, они не считаются похожими.

**Важно:**

- **Выбирай только из строк, предоставленных в списке вариантов. Не используй и не придумывай другие строки.**
- **Не добавляй и не изменяй никакие строки; используй только те, что даны в списке вариантов.**
- **Даже если тебе кажется, что существует строка, которая лучше подходит, но её нет в списке вариантов, не используй её.**

Выведи **только** следующий JSON без каких-либо дополнительных пояснений, текста или форматирования:

{{"closest": "[самая похожая строка из списка B]"}}

Где:

- `[самая похожая строка из списка B]` — строка из списка B, которая наиболее похожа на строку A.
"""
}