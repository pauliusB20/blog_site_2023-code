from app import app
from app.models import User, Post
from app import db
from flask import request, redirect, url_for, send_file
import hashlib
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
import os
import io
from zipfile import ZipFile
import pathlib
from datetime import datetime
import shutil

@app.route('/test')
def test():
    return "Hello world"

@app.route('/register', methods=['POST', 'GET'])
def register():
    user_data = request.json
    # print(user_data)
    not_exist_field_count = 0
    fields = ["username", "password", "email"]

    for field in fields:
       if not (field in user_data) or not user_data[field]:
         not_exist_field_count = not_exist_field_count + 1
    
    if not_exist_field_count:
        return {"status": "Failed", "msg": "Bad input received!"}

    try:
        password_hashed = hashlib.md5((user_data["password"]).encode()).hexdigest()
        user = User(username=user_data["username"], password_hash=password_hashed, email=user_data["email"])
        db.session.add(user)
        db.session.commit()

        token = hashlib.md5((user_data["username"] + user_data["password"]).encode()).hexdigest()

        return {"status": "Success", "msg": "OK", "token" : token}

    except Exception as error:

        return {"status": "Error", "msg" : str(error)}



@app.route('/login', methods=['POST', 'GET'])
def login():
    user_data = request.json   
    password = user_data["password"]
    password_hashed = hashlib.md5((password).encode()).hexdigest()
    print(f"Received password: {password}")
    # print(f"Received login data {user_data}")

    # Validating user input
    if not ("username" in user_data) or not user_data["username"]:
        return {"status": "Failed", "msg": "Bad input received!"}

    # Checking user data
    select_user = User.query.filter_by(username=user_data["username"]).first()

    if not select_user:
        return {"status": "Failed", "msg": "User not found!"}
    
    # Checking if passwords match
    if not (select_user.password_hash == password_hashed):
        return {"status": "Failed", "msg": "Invalid password!"}

    token = hashlib.md5((select_user.username + select_user.password_hash).encode()).hexdigest()

    user_details = {"username" : select_user.username, "email" : select_user.email}

    return {"status": "OK", "token": token, "user_details" : user_details}

# FIX: Art creation and edit feature
@app.route('/create_post', methods=['POST', 'GET'])
def create_post(): 
    if not request.form['author']:
        return {"status" : "error", "msg" : "No author username received! Can not create a new post!"} 

    author_data = User.query.filter_by(username = request.form['author']).first()
    if not author_data:
        return {"status" : "error", "msg" : "Invalid author username received!"}
    
    post_title = request.form['title']
    post_description = request.form['post_info']    
    
    action = request.form['action']    
    file_to_save = request.files['file'] if 'file' in request.files else None
    full_saved_image_path = ""  
    print(f"Received: {file_to_save}")
    if file_to_save != None:        
        # Creating a new folder and saving a new image
        saving_file_name = file_to_save.filename

        # Creating a new folder      
        save_folder_location = os.path.join(os.path.dirname(__file__), 'static')
        full_save_folder_location = os.path.join(save_folder_location, post_title.replace(" ", ""))

        # # Remove folder if exists
        if os.path.exists(full_save_folder_location):
            shutil.rmtree(full_save_folder_location)

        os.mkdir(full_save_folder_location)

        full_saved_image_path = os.path.join(full_save_folder_location, secure_filename(saving_file_name))
        print(f"New path: {full_saved_image_path}") 
        file_to_save.save(full_saved_image_path)   
                            

    if action == "create":
        post_exists = Post.query.filter_by(title=post_title).first()

        if post_exists:
            return {"status" : "error", "msg" : f"Post by title={post_title} already exists!"}
        
        # Creating new post
        post_type = request.form['post_type']

        if not (post_type in ("News", "Art", "Bio")):
            return {"status" : "error", "msg" : "Error can not create a new post! No post type information received!"}       
            
        new_post = Post(title=post_title, 
                        body=post_description, 
                        post_type=post_type, 
                        image_source=full_saved_image_path, 
                        author=author_data)
        
        db.session.add(new_post)

    # Updating post
    elif action == "update":  
        old_post_title =  request.form["old_post_title"] if "old_post_title" in request.form else ""
        using_title = post_title
        
        if len(old_post_title) > 0:
            using_title = old_post_title
            # Checking if new title is already used
            post_exists = Post.query.filter_by(title=post_title).first()
            if post_exists:
                return {"status" : "error", "msg" : f"Post by title={post_title} already exists!"}           
             
        print(f"Using title {using_title}")
        existing_post = Post.query.filter_by(title=using_title).filter_by(author=author_data).first()
        existing_post.title = post_title        
        existing_post.body = post_description

        # Fix new path assignment, when uploading new path in edit
        if len(full_saved_image_path) > 0:
            existing_post.image_source = full_saved_image_path

        if os.path.exists(existing_post.image_source):

            path = os.path.normpath(existing_post.image_source)
            path_components = path.split(os.sep)

            if path_components[len(path_components) - 2] != post_title.replace(" ", ""):
               existing_file = path_components[len(path_components) - 1]

               # Creating old path
               #  For universal purposes, fix in the future. Add \\ to json cofnig
               path_components[0] = path_components[0] + '\\'              

               # Creating new path
               path_components.pop()
               old_path = os.path.join(*path_components)
               path_components[len(path_components) - 1] = post_title.replace(" ", "")
               
               new_path = os.path.join(*path_components)              
            
               os.rename(old_path, new_path)
              
               existing_post.image_source = os.path.join(new_path, existing_file)
        
        db.session.merge(existing_post)


    db.session.commit()

    return {"status" : "ok"}
    

@app.route("/gallery_data", methods=['GET'])
def gallery():  
    art_posts_display = [
        {
         "title" : post.title, 
         "body" : post.body, 
         "image" :  os.path.basename(post.image_source),
         "author" : post.author.username,
         "date" : post.timestamp
         } for post in Post.query.filter_by(post_type="Art").all()]
    
    # print(art_posts_display)
    return {"posts" : art_posts_display}

@app.route("/news", methods=['GET'])
def news():
    news_posts_db = [{"title" : news_post.title,
                      "body" : news_post.body,
                      "image" : news_post.image_source,
                      "author_username" : news_post.author.username,
                      "post_date" : f'{news_post.timestamp:%Y-%m-%d}'} 
                      for news_post in Post.query.filter_by(post_type="News").all()]
    
    return {"news_posts" : news_posts_db}

@app.route("/delete_post", methods=['POST', 'GET'])
def delete_post():
    delete_by_data = request.form  

    if not delete_by_data["title"] and not delete_by_data["author"]:
        return {"status" : "error", "msg" : "Unauthorized to delete! Didn't received post id and username!"}

    author = User.query.filter_by(username=delete_by_data["author"]).first()
    post = Post.query.filter_by(author=author, title=delete_by_data["title"]).first()

    try:

        # Removing image folder if path is available
        if post.image_source != "":
            try:
                shutil.rmtree(os.path.dirname(os.path.abspath(post.image_source)))
            except Exception as error:
                print(error)

        db.session.delete(post)
        db.session.commit()

        return {"status" : "OK", "msg" : "Record deleted!"}

    except Exception as error:
        return {"status" : "error", "msg" : str(error)}

@app.route("/image", methods=['POST', 'GET'])
def image():
    data = request.json

    if not ("file_name" in data) and not("post_title" in data):
        return {"error" : "No image name and post title received!"}

    image_name = data["file_name"]
    post_title = data["post_title"].replace(" ", "")
    img_path = f"{post_title}/{image_name}" #In future, try to forget this path construction idea!
    # print(img_path)

    return {"url" : url_for('static', filename=img_path)}

@app.route("/edit_news", methods=['POST', 'GET'])
def edit_news():
    new_post_data = request.form
    title = ""
    new_title = ""

    try:
        title = new_post_data['old_title']
        new_title = new_post_data['new_title']

        if bool(Post.query.filter_by(title=new_title).first()):
            return {"status" : "error", "msg" : "Post with this title already exists!"}
        
    except:
        title = new_post_data['title']
        print("No title change detected! Skipping title check...")

    post = Post.query.filter_by(title=title).first()
    post.title = new_title if new_title != "" else title
    post.body = new_post_data['body']
    db.session.commit()

    return {"status" : "ok"}

@app.route("/aboutme", methods=["POST", "GET"])
def aboutme():
    aboutme_post = Post.query.filter_by(post_type="Bio").first()

    if aboutme_post:
        return {
            "status" : "ok", 
            "bio_data" : {
                "title" : aboutme_post.title, 
                "body" : aboutme_post.body,
                "timestamp" : f'{aboutme_post.timestamp:%Y-%m-%d}',
                "author" : aboutme_post.author.username,
                "img_source" : os.path.basename(aboutme_post.image_source)
            }}
    
    return {"status" : "nothing"}


