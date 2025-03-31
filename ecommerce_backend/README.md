# Backend


source .venv/bin/activate

pip freeze > requirements.txt

python manage.py makemigrations
python manage.py migrate

python manage.py runserver 8080



python manage.py flush

python manage.py migrate