package templates

import "text/template"

func RegisterTemplate() string {
	return `
	<!DOCTYPE html>
	<html>
	<head>
	    <style>
	        body {
	            font-family: Arial, sans-serif;
	            margin: 40px;
	            background-color: #f4f4f9;
	            color: #333;
	        }
	        .container {
	            background-color: #fff;
	            border: 1px solid #dedede;
	            border-radius: 5px;
	            padding: 20px;
	            margin-top: 20px;
	        }
	        h1 {
	            color: #4A90E2;
	        }
	        a {
	            color: #4A90E2;
	            text-decoration: none;
	            border-bottom: 1px solid #4A90E2;
	            transition: color 0.5s, border-bottom-color 0.5s;
	        }
	        a:hover, a:focus {
	            color: #d35400;
	            border-bottom-color: #d35400;
	        }
	        footer {
	            margin-top: 20px;
	            font-size: 12px;
	            text-align: center;
	            color: #999;
	        }
	    </style>
	</head>
	<body>
	    <div class="container">
	        <h1>Уважаемый пользователь!</h1>
	        <p>Вы получили это письмо, потому что на сайте <a href="https://task.shmyaks.ru/">PLANIFY</a> был зарегистрирован аккаунт с вашим email.</p>
	        <p>Если это были не вы, обратитесь в поддержку нашего сайта: <a href="mailto:smyakneksbimisis@gmail.com">smyakneksbimisis@gmail.com</a></p>
	    </div>
	    <footer>
	        © 2024 PLANIFY. Все права защищены.
	    </footer>
	</body>
	</html>
	`
}

func ProjectInvitationTemplate() *template.Template {
	return template.Must(template.New("projectInvitation").Parse(`
	<!DOCTYPE html>
	<html>
	<head>
	    <style>
	        body {
	            font-family: Arial, sans-serif;
	            margin: 40px;
	            background-color: #f4f4f9;
	            color: #333;
	        }
	        .container {
	            background-color: #fff;
	            border: 1px solid #dedede;
	            border-radius: 5px;
	            padding: 20px;
	            margin-top: 20px;
	        }
	        h1 {
	            color: #4A90E2;
	        }
	        a {
	            color: #4A90E2;
	            text-decoration: none;
	            border-bottom: 1px solid #4A90E2;
	            transition: color 0.5s, border-bottom-color 0.5s;
	        }
	        a:hover, a:focus {
	            color: #d35400;
	            border-bottom-color: #d35400;
	        }
	        footer {
	            margin-top: 20px;
	            font-size: 12px;
	            text-align: center;
	            color: #999;
	        }
	    </style>
	</head>
	<body>
	    <div class="container">
	        <h1>Приглашение в проект "{{ .ProjectName }}"</h1>
	        <p>Уважаемый пользователь,</p>
	        <p>Вы были приглашены пользователем {{ .InviterName }} присоединиться к проекту <strong>{{ .ProjectName }}</strong> на сайте <a href="https://task.shmyaks.ru/">PLANIFY</a>.</p>
	        <p>Чтобы принять приглашение, пожалуйста, перейдите по следующей ссылке:</p>
	        <p><a href="{{ .InvitationLink }}">Принять приглашение</a></p>
	        <p>Если у вас есть вопросы, свяжитесь с поддержкой нашего сайта: <a href="mailto:smyakneksbimisis@gmail.com">smyakneksbimisis@gmail.com</a></p>
	    </div>
	    <footer>
	        © 2024 PLANIFY. Все права защищены.
	    </footer>
	</body>
	</html>
	`))
}
