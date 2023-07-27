from app import app
from app.models import User
from app import db

if __name__ == "__main__":
    with app.app_context():
        print("Starting data seeder tool")
        user = User(username="Test12", password_hash="Test12p", email="Test12@gmail.com")
        print(f"Adding user username={user.username} to local db...")

        db.session.add(user)
        db.session.commit()

        print("DONE")