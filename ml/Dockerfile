FROM python:3.10.6
WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "8000"]
