# InnoHack
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)![Go](https://img.shields.io/badge/golang-%23007ACC.svg?style=for-the-badge&logo=go&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![Figma](https://img.shields.io/badge/figma-%2320232a.svg?style=for-the-badge&logo=figma)![Jenkins](https://img.shields.io/badge/jenkins-%2320232a.svg?style=for-the-badge&logo=jenkins)



# [Ссылка на готовое решение](https://task.shmyaks.ru/signin)

### Трек: Создать высокопроизводительное приложение для управления проектами, которое будет включать в себя функционал для работы с задачами, пользователями и интеграции с внешними системами.


## Используемый стек технологий:
- [GO-Backend](https://github.com/ultraevs/AtomicHack/tree/main/go-backend) - Реализован с использванием [GO](https://go.dev/) и фреймворка [Gin](https://github.com/gin-gonic/gin). Задачей модуля является реализация API для взаимодействия с frontend модулем.
- [ML](https://github.com/ultraevs/inno_hack/tree/main/ml) - Реализован с использванием [Python](https://www.python.org/) и фреймворка [FastAPI](https://fastapi.tiangolo.com/). Задачей модуля является реализация ИИ фич проекта.
- [Frontend](https://github.com/ultraevs/inno_hack/tree/main/frontend) - Реализован с использованием [React](https://ru.legacy.reactjs.org/). Задачай является предоставление красивого и функционалоного интерфейса для пользователя.
- [Deployment](https://github.com/ultraevs/inno_hack/tree/main/deployment) - Реализован с использованием [Docker-Compose](https://www.docker.com/). Задачей модуля является возможность быстрого и безошибочного развертывания приложения на любом сервере.


## Функционал решения

- Создание, чтение, обновление и удаление проектов и задач.
- Получение списка задач по статусу и проектам.
- Аутентификация пользователей.
- Отправка уведомлений по электронной почте.
- Интеграция с GitLab и Jenkins.
- Unit Тесты
- FigmaAPI и YandexGPT

## Запуск решения
```sh
    cd inno_hack/deployment
    docker-compose build
    docker-compose up -d
```
#### Необходимо создать .env файлы в папке java-backend, frontend, в которых должны содержаться ваши данные о сервере,базе данных и почтовом аккаунте. Также в вашем nginx и postgresql на сервере нужно указать те же порты что и в коде(местами из .env)


# FicHack
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)![TensorFlow](https://img.shields.io/badge/tensorflow-%23007ACC.svg?style=for-the-badge&logo=tensorflow)![Figma](https://img.shields.io/badge/figma-%2320232a.svg?style=for-the-badge&logo=figma)<img src="https://raw.githubusercontent.com/ultralytics/assets/main/logo/Ultralytics_Logotype_Reverse.svg" width="150" height="auto" style="filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(188deg) brightness(94%) contrast(88%);">


##  Состав команды
 - Михаил Евсеев - Backend Developer
 - Артем Брежнев - Designer
 - Иван Лобода - 
 - Костя Цой - Frontend Developer
 - Глеб Таланцев - Project Manager

## Итог
Проект представляет собой инновационное решение для классификации опор линий электропередач (ЛЭП). Его значимость заключается в интеграции современных технологий компьютерного зрения с удобным пользовательским интерфейсом. Благодаря использованию мощных инструментов, таких как YOLOv11, FastAPI, React и Docker, команда создала продукт, способный автоматически распознавать типы и категории опор с высокой точностью.

Этот проект выделяется на фоне аналогов своей гибкостью, функциональностью и модульной архитектурой, что делает его легко адаптируемым к различным сценариям использования. Решение экономит время и ресурсы для специалистов, занимаясь рутинной обработкой данных, и может быть применено в таких областях, как инвентаризация, мониторинг и анализ инфраструктуры ЛЭП.

## Возможные улучшения
Расширение функциональности:

Добавление новых категорий и подтипов опор для более точной классификации.
Включение возможности обработки видео для детекции опор в реальном времени.
Улучшение UX/UI:

Разработка мобильного приложения для упрощения работы в полевых условиях.
Визуализация результатов в формате интерактивных карт.
Технические улучшения:

Интеграция моделей на базе больших языковых моделей для анализа текста и голосовых команд.
Ускорение процесса обработки изображений с использованием аппаратного ускорения (GPU).
Автоматизация развертывания:

Добавление поддержки CI/CD для еще более быстрого и удобного развертывания.

