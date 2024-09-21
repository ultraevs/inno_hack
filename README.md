# ML Task Generator

This project is an ML-based task generator for an online projects. It uses FastAPI for the backend and integrates with Yandex GPT for generating new tasks based on the project description and existing tasks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ultraevs/inno_hack.git
    cd ml
    ```

2. Create a virtual environment and activate it:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required dependencies:
    ```sh
    pip install -r requirements.txt
    ```

## Usage

1. Start the FastAPI server:
    ```sh
    uvicorn ml.backend:app --reload
    ```

2. Open your browser and navigate to `http://127.0.0.1:8000` to see the root page.

3. To generate new tasks, you can use the example script provided in [ml/example.py](ml/example.py):
    ```sh
    python ml/example.py
    ```

## Project Structure


- [`ml/backend.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FSehap%2FDocuments%2Fhackathons%2Finno_hack%2Fml%2Fbackend.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%2220aa21f0-0c99-41e2-9913-29031c7bc3af%22%5D "c:\Users\Sehap\Documents\hackathons\inno_hack\ml\backend.py"): Contains the FastAPI application and the task processing logic.
- [`ml/example.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FSehap%2FDocuments%2Fhackathons%2Finno_hack%2Fml%2Fexample.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%2220aa21f0-0c99-41e2-9913-29031c7bc3af%22%5D "c:\Users\Sehap\Documents\hackathons\inno_hack\ml\example.py"): Example script to generate new tasks.
- [`ml/gpt.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FSehap%2FDocuments%2Fhackathons%2Finno_hack%2Fml%2Fgpt.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%2220aa21f0-0c99-41e2-9913-29031c7bc3af%22%5D "c:\Users\Sehap\Documents\hackathons\inno_hack\ml\gpt.py"): Contains the GPT class for interacting with Yandex GPT.
- [`ml/prompts.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FSehap%2FDocuments%2Fhackathons%2Finno_hack%2Fml%2Fprompts.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%2220aa21f0-0c99-41e2-9913-29031c7bc3af%22%5D "c:\Users\Sehap\Documents\hackathons\inno_hack\ml\prompts.py"): Contains the prompt templates for task generation.
- [`ml/root.html`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FSehap%2FDocuments%2Fhackathons%2Finno_hack%2Fml%2Froot.html%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%2220aa21f0-0c99-41e2-9913-29031c7bc3af%22%5D "c:\Users\Sehap\Documents\hackathons\inno_hack\ml\root.html"): HTML file for the root endpoint.

## API Endpoints

- `GET /`: Serves the [`root.html`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FSehap%2FDocuments%2Fhackathons%2Finno_hack%2Fml%2Froot.html%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%2220aa21f0-0c99-41e2-9913-29031c7bc3af%22%5D "c:\Users\Sehap\Documents\hackathons\inno_hack\ml\root.html") file.
- `POST /generate_tasks`: Generates new tasks based on the provided project description and existing tasks.

## License

This project is licensed under the MIT License. See the [`LICENSE`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2FSehap%2FDocuments%2Fhackathons%2Finno_hack%2FLICENSE%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%2220aa21f0-0c99-41e2-9913-29031c7bc3af%22%5D "c:\Users\Sehap\Documents\hackathons\inno_hack\LICENSE") file for details.
