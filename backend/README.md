python3 -m venv env       

source env/bin/activate

pip install fastapi uvicorn sqlalchemy pymysql 'passlib[bcrypt]' python-jose

uvicorn main:app --reload

Note:

You need to run source after importing things for the environement to recognize you downloaded the packages