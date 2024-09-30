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
