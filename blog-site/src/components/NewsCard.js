import axios from "axios";
import { useState } from "react";
import Modal from 'react-modal';
import configData from "../config.json";

function NewsCard(props) {
  const REACT_APP_API_SERVER=configData.SERVER_URL;
  const [postDetails, setPostDetails] = useState({
    title: "",
    body: ""
  })
  const [old_title, set_old_title] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);
  const min_text_size = Math.round((props.body.length * 15)/100);
 

  Modal.setAppElement('#root');

  const modal_style = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '1px 1px'
    },
  };

  function closeModal(){
    setIsOpen(false);
  }
  function openModal(){
    setIsOpen(true);
    set_old_title(props.title);
    setPostDetails({
      title: props.title,
      body: props.body
    })
  }
  function submitPostDetails(event){
    event.preventDefault();
    const formData = new FormData();

    if (old_title !== postDetails.title)
    {
      formData.append("new_title", postDetails.title);
      formData.append("old_title", old_title);
    }
    else{
      formData.append("title", postDetails.title);
    }
    formData.append("body", postDetails.body);

    axios.post(`${REACT_APP_API_SERVER}/edit_news`, formData).then((res) => {
      setInterval(function(){
        window.location = "/blogs";
      }, 1000);

    }).catch(error => console.log(error.response));
    
  }

  // delete post 
  function delete_post(){
    const formData = new FormData();
    formData.append("author", localStorage.getItem('username'));
    formData.append("title", props.title);
    axios.post(`${REACT_APP_API_SERVER}/delete_post`, formData)
      .then((res) => {
        const deletion_status = res.data;
        
        if (deletion_status.status === "OK"){
            setInterval(function(){
                window.location = "/blogs";
              }, 1000);
        }

      }).catch(error => console.log(error));
  }

  return ( 
            <div className='col-lg-4 col-md-12' style={{marginTop: "1%"}}>
                  <div className='card border-primary box-shadow' style={{textAlign: "left", margin: "auto"}}>
                      <div className='card-title news-post-title'>
                          <h3 style={{textAlign: "left"}}>{props.title}</h3>
                      </div>

                      <div className='card-body bg-light'>
                        {min_text_size > 10 ? <p>{props.body.substring(0, min_text_size)}...</p> : <p>{props.body}</p>}
                        <br/>  
                        <button className="btn btn-outline-primary" onClick={() => props.display_post_info(props)}>View</button>
                        {(localStorage.getItem('username') === props.author) && (
                          <>                  
                          <button style={{marginLeft: "2%"}} className="btn btn-warning" onClick={() => props.openEditWindow(props)}>Edit</button>                        
                          <button style={{marginLeft: "2%"}} className="btn btn-danger" onClick={() => delete_post()}>Delete</button>
                          </>  
                          )}  
                      </div>
                      <div className="footer" style={{margin: "auto"}}> 
                      <p>Posted by {props.author} on {props.post_date}</p><br/>
                      
                          </div>
                  </div>
            </div>
         
  )
}

export default NewsCard