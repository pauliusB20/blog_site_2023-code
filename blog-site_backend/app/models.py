from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    posts = db.relationship('Post', backref='author', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_type = db.Column(db.String(255), index=True, nullable=False)
    title = db.Column(db.String(255), index=True, unique=True)
    body = db.Column(db.String(140))
    image_source = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # NOTE: Create a post type column and add logic about it in backend and frontend
    # post_type = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return '<Post {}>'.format(self.body)
    
    # NOTE: Create seperate table for post images