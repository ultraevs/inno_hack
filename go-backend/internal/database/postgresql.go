package database

import (
	"database/sql"
	"fmt"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"os"
	"strconv"
)

var Db *sql.DB

func ConnectDatabase() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error occurred while loading .env file, please check")
	}
	// Read environment variables from .env file
	host := os.Getenv("HOST")
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	user := os.Getenv("POSTGRES_USER")
	dbname := os.Getenv("POSTGRES_DB")
	pass := os.Getenv("POSTGRES_PASSWORD")
	psqlSetup := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable",
		user, pass, host, port, dbname)
	db, errSql := sql.Open("postgres", psqlSetup)
	if errSql != nil {
		fmt.Println("There is an error while connecting to the database: ", errSql)
		panic(errSql)
	} else {
		Db = db
		fmt.Println("Successfully connected to the database!")
	}

	createTablesQuery := `
	CREATE TABLE IF NOT EXISTS notion_users (
		id SERIAL PRIMARY KEY,  -- Идентификатор пользователя
		name VARCHAR(255) NOT NULL,  -- Имя пользователя
		email VARCHAR(255) NOT NULL, -- Email пользователя
		password VARCHAR(255) NOT NULL,	-- Пароль пользователя
		CONSTRAINT unique_name UNIQUE (name)
	);

	CREATE TABLE IF NOT EXISTS notion_projects (
	    id SERIAL PRIMARY KEY,
	    name VARCHAR(255) NOT NULL,             -- Название проекта
	    description TEXT,                       -- Описание проекта
    	owner_name VARCHAR(255) REFERENCES notion_users(name) ON DELETE SET NULL,  -- Владелец проекта, идентификация по 'name#0000'
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Время создания проекта
	    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Время последнего обновления
	    view_mode VARCHAR(50) DEFAULT 'text'    -- Текущий вид проекта: 'text' или 'task_table'
	);

	CREATE TABLE IF NOT EXISTS notion_project_users (
    	project_id INT REFERENCES notion_projects(id) ON DELETE CASCADE, -- Проект
    	user_name VARCHAR(255) REFERENCES notion_users(name) ON DELETE CASCADE, -- Участник (по имени)
    	PRIMARY KEY (project_id, user_name) -- Уникальность записи: один пользователь в одном проекте
	);
	
	CREATE TABLE IF NOT EXISTS notion_text_projects (
    	id SERIAL PRIMARY KEY,
    	project_id INT REFERENCES notion_projects(id) ON DELETE CASCADE,
    	content TEXT                            -- Текстовый контент проекта
	);

	CREATE TABLE IF NOT EXISTS notion_tasks (
		id SERIAL PRIMARY KEY,
		title VARCHAR(255) NOT NULL,                  -- Название задачи
		description TEXT,                             -- Описание задачи
		project_id INT REFERENCES notion_projects(id) ON DELETE CASCADE,  -- Проект, к которому принадлежит задача
		assignee_name VARCHAR(255) REFERENCES notion_users(name)  ON DELETE SET NULL,  -- Исполнитель задачи
		status VARCHAR(50) NOT NULL,                  -- Статус задачи (например, 'To Do', 'In Progress', 'Done')
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Время создания задачи
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Время последнего обновления
		deadline TIMESTAMP,                           -- Дедлайн задачи
		start_time TIMESTAMP,                         -- Время начала выполнения задачи
		end_time TIMESTAMP,                           -- Время завершения задачи
		duration INTERVAL                             -- Продолжительность выполнения задачи
	);

	CREATE TABLE IF NOT EXISTS notion_project_invitations (
	    id SERIAL PRIMARY KEY,
	    project_id INT REFERENCES notion_projects(id) ON DELETE CASCADE,
	    invitee_name VARCHAR(255) NOT NULL,  -- Email приглашаемого пользователя
	    inviter_name VARCHAR(255) REFERENCES notion_users(name),  -- ID пригласившего пользователя
	    status VARCHAR(20) DEFAULT 'pending',  -- Статус: pending, accepted, declined
	    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	`

	_, err = Db.Exec(createTablesQuery)
	if err != nil {
		fmt.Println("An error occurred while creating the tables:", err)
		panic(err)
	} else {
		fmt.Println("Tables have been created successfully or already exist")
	}
}