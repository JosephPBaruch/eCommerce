FROM python:3.10-slim

WORKDIR /ecommerce_backend

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8080"]
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8080"]

# docker build -t backend  .
# docker run -d -p 8080:8080 --name backend backend:latest