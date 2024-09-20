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
		fmt.Println("Error is occurred  on .env file please check")
	}
	//we read our .env file
	host := os.Getenv("HOST")
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	user := os.Getenv("POSTGRES_USER")
	dbname := os.Getenv("POSTGRES_DB")
	pass := os.Getenv("POSTGRES_PASSWORD")
	psqlSetup := fmt.Sprintf("postgres://%v:%v@%v:%v/%v?sslmode=disable",
		user, pass, host, port, dbname)
	db, errSql := sql.Open("postgres", psqlSetup)
	if errSql != nil {
		fmt.Println("There is an error while connecting to the database ", err)
		panic(err)
	} else {
		Db = db
		fmt.Println("Successfully connected to database!")
	}
	createTablesQuery := `
	CREATE TABLE IF NOT EXISTS notion_users (
		id SERIAL PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL,
		password VARCHAR(255) NOT NULL
	);
	`
	_, err = Db.Exec(createTablesQuery)
	if err != nil {
		fmt.Println("An error occurred while creating the table:", err)
		panic(err)
	} else {
		fmt.Println("Tables have been created successfully or already exist")
	}
}
