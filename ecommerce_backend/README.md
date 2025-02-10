# Backend


source .venv/bin/activate

python manage.py makemigrations
python manage.py migrate

python manage.py runserver 8080



python manage.py flush

python manage.py migrate