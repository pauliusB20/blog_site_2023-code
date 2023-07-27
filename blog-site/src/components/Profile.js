import {useState} from 'react'
import NavBar from './NavBar'
import Modal from 'react-modal';
import axios from 'axios';
import configData from "../config.json";

function Profile(props) {
  const REACT_APP_API_SERVER=configData.SERVER_URL;
  const valid_image_formats = ["image/png", "image/jpeg"]  
  Modal.setAppElement('#root');
  const [postDetails, setPostDetails] = useState({
    title: "",
    body: "",
    file_details: null,
    file_path: "",
    post_type: ""
  });
  const [bioPicExists, setBioPicExists] = useState(false); 
  const [createPostFormState, setOpenCreatePostForm] = useState(false);

  function openCreateForm(){
    setOpenCreatePostForm(true);
  }

  function closeCreateForm(){
    setOpenCreatePostForm(false);
  }

  function handlePost(event){

    const field_name = event.target.name;
    const field_value = event.target.value;
    // console.log(`Input field name and value: ${field_name}, ${field_value}`);

    setPostDetails(prevValue => {
      if (field_name === "post_type"){
        return {
          title: prevValue.title,
          body: prevValue.body,
          file_details: prevValue.file_details,
          file_path: prevValue.file_path,
          post_type: field_value
      }
      }
      if (field_name === "post_title"){
        return {
            title: field_value,
            body: prevValue.body,
            file_details: prevValue.file_details,
            post_type: prevValue.post_type
        }
      }
      else if (field_name === "post_info"){
        return {
          title: prevValue.title,
          body: field_value,
          file_details: prevValue.file_details,
          post_type: prevValue.post_type
        }
      }
      else if (field_name === "file_path"){
        var file_to_send = event.target.files[0];

        if (!valid_image_formats.includes(file_to_send.type))
        {
          alert("ERROR: Invalid file selected!\nImage files(*.png, *.jpg, *.jfif, *.pjpg) are supported for the upload!");
          window.location.reload();
        }

        return {
          title: prevValue.title,
          body: prevValue.body,
          file_details: file_to_send,
          post_type: prevValue.post_type
        }
      }

    });
  }
  axios.get(`${REACT_APP_API_SERVER}/aboutme`).then(res => {
    if (res.data.hasOwnProperty("bio_data") && !bioPicExists){          
      setBioPicExists(true);         
    }
  
  });
  async function upload_post(postDetails){
    const formData = new FormData();
    const author_name = localStorage.getItem('username');
    formData.append("author", author_name);
    formData.append("title", postDetails.title);
    formData.append("file", postDetails.file_details);
    formData.append("post_info", postDetails.body);
    formData.append("post_type", postDetails.post_type)
    formData.append("action", "create");

    axios.post(`${REACT_APP_API_SERVER}/create_post`, formData)
      .then((res) => {
        console.log("File Upload success");
        console.log(postDetails);
        if (res.status !== "error"){
            props.displayToast("New post created!", "success");
            setInterval(function(){
              switch(postDetails.post_type){
                case "Art":
                  window.location = "/gallery";
                  break;
                case "Bio":
                  window.location = "/aboutme";
                  break;
                case "News":
                    window.location = "/blogs";
                break;
              }
              
            }, 1000);
        }
        else{
          console.log(`ERROR: ${res.msg}`);
          props.displayToast(res.msg, "error");
        }
      })
      .catch(function(err) { 
        console.log("File Upload Error: " + err);
        props.displayToast(err, "error");
      });   
   
  }
  async function submitPostDetails(event){
    event.preventDefault();
    await upload_post(postDetails);
  }

  const user_details = {
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email')
  }

  // Logining out management
  function logout_user(){
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');

    setInterval(function() {
       window.location = "/blogs";
    }, 1000);
  }


  return (
    <div className="App">
        <NavBar />
        {props.renderToast()}
        {!createPostFormState &&  <div className='row justify-content-md-center' style={{marginTop: "2%"}}>
            <div className='col-lg-6'>
                <div className='card border-primary box-shadow profile-info-form'>
                    <div className='card-title' style={{padding: "1%"}}>
                        <h3>Admin user's {user_details.username}<br/>{props.title}</h3>
                    </div>

                    <div className='card-body bg-light' style={{textAlign: "left"}}>
                       <div className='row'>
                          <div className='card'>
                            <div className='row' style={{padding: "2%"}}>
                              <div className='col-lg-4 col-md-2'>
                                <p>Username:</p>
                              </div>
                              <div className='col-lg-4 col-md-4'>
                                <p>{user_details.username}</p>
                              </div>
                            </div>
                          </div>
                       </div>

                       <div className='row'>
                          <div className='card'>
                            <div className='row' style={{padding: "2%"}}>
                              <div className='col-lg-4 col-md-2'>
                                <p>Email:</p>
                              </div>
                              <div className='col-lg-4 col-md-4'>
                                <p>{user_details.email}</p>
                              </div>
                            </div>
                          </div>
                       </div>

                       <div className='row'> 
                          <div className='card'>  
                            <div className='row' style={{padding: "2%"}}>               
                              <div className='col-lg-4 col-md-4'>
                                <p>Activity:</p>
                              </div>
                              <div className='col-lg-4 col-md-4'>
                                <p>Online&#128994;</p>
                              </div>
                            </div>  
                          </div>    
                       </div>

                       <div className='row'>
                          <div className='card' style={{padding: "2%"}}>     
                            <div className='col-lg-7'>
                                <p>Available user actions</p>
                            </div>
                            <div className='col-lg-6'>
                              <button className='btn btn-warning' onClick={() => openCreateForm()}>Create new post</button>                            
                                  <button style={{marginLeft: "2%"}} className='btn btn-danger' onClick={() => logout_user()}>Logout</button> 
                              </div>
                          </div>
                       </div>                     
                       
                    </div>
                </div>
            </div>
        </div>}

        {createPostFormState && <div className='row justify-content-md-center' style={{marginTop: "2%"}}>
          <div className='col-lg-6'>
            <div className='card border-primary box-shadow'>
              <div className='card-header'>
                <div className='row'>
                    <h3 className='card-title hit-form-title'>Create a new post</h3>                    
                </div>
              </div>
              <div className='card-body' style={{textAlign: "left"}}>
                <form onSubmit={submitPostDetails}>
                  <div className='row' style={{padding: "2% 0%"}}>
                    <div className='col-lg-4'>
                        <label>Title:</label>
                    </div>
                    <div className='col-lg-7'>
                        <input type="text" style={{width: "100%"}} name="post_title" value = {postDetails.title} onChange={handlePost}/>
                    </div>
                  </div>
                  <div className='row' style={{padding: "2% 0%"}}>
                    <div className='col-lg-4'>
                        <label>Description:</label>
                    </div>
                    <div className='col-lg-7'>
                        <textarea name="post_info" style={{width: "100%"}} placeholder='Write info text...' rows="5" cols="50" value = {postDetails.body} onChange={handlePost}/>
                    </div>
                  </div>

                  <div className='row' style={{padding: "2% 0%"}}>
                    <div className='col-lg-4'>
                          <label>Post type:</label>
                      </div>
                    <div className='col-lg-6'>
                        <select name="post_type" id="post_type" onChange={handlePost}>
                          <option value="Default">Choose post type</option>
                          <option value="News">Blog</option>
                          <option value="Art">Art</option>
                          {!bioPicExists && <option value="Bio">Biography</option>}
                        </select><br/>
                    </div>
                  </div>

                  {(postDetails.post_type === "Art" || postDetails.post_type === "Bio") && <div className='row' style={{padding: "2% 0%"}}>
                        <div className='col-lg-4'>
                            <label>Uploading file:</label>
                        </div>
                        <div className='col-lg-6'>
                          <input type="file" className='btn btn-info' name='file_path' value = {postDetails.file_path} onChange={handlePost} accept="image/png, image/jpeg"/>
                        </div>            
                      </div>}

                  <div className='row' style={{padding: "2% 0%"}}>
                      <div className='col-lg-6'>     
                          <button className='btn btn-warning'>Create</button>                         
                          <button className='btn btn-danger'  style={{marginLeft: "3%"}} onClick={() => closeCreateForm()}>Cancel</button>                           
                      </div>                                 
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>}
       

        {/* <Gallery title="3D modelling art"/> */}
    </div>
  )
}

export default Profile