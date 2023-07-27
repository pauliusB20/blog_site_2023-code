import { useState } from 'react'
import NavBar from './NavBar'
import PageHeader from './PageHeader'
import axios from 'axios';
import AboutMeCard from './AboutMeCard';
import configData from "../config.json"; 


function AboutMe(props) {
    const REACT_APP_API_SERVER=configData.SERVER_URL;
    const [editAboutMeState, setAboutMeState] = useState(false);
    const [loading, setLoading] = useState(true);
    const [aboutme_data, set_aboutme_data] = useState({
        title: "",
        body: "",
        profile_img: "",
        raw_img_source: ""
    });

    const [postDetails, setPostDetails] = useState({
        title: "",
        body: "",
        file_details: null
      });

    const [old_post_title, set_old_post_title] = useState("");

    function openEditWindow(){
        setAboutMeState(true);
        set_old_post_title(aboutme_data.title);
        setPostDetails({
            title: aboutme_data.title,
            body: aboutme_data.body,
            file_details: null
        })
    }

    function handleUpdateDetails(event){
        var target_name = event.target.name;
        var target_value = event.target.value;

        setPostDetails(prevValue => {
            if (target_name === "title"){
                return {
                    title: target_value,
                    body: prevValue.body
                }
            }
            if (target_name === "post_info"){
                return {
                    title: prevValue.title,
                    body: target_value
                }
            }
            if (target_name === "file_path"){
                return {
                    title: prevValue.title,
                    body: prevValue.body,
                    file_details:  event.target.files[0]
                }
            }
        })
    }

    function submitDetails(event){
        const formData = new FormData();

        formData.append("post_info", postDetails.body);
        formData.append("title", postDetails.title);
        formData.append('author', localStorage.getItem('username'));
        formData.append('action', "update");

        if (old_post_title != postDetails.title){
            formData.append("old_post_title", old_post_title)  
                    
        }       
        if (postDetails.file_details)
            formData.append("file", postDetails.file_details) 

        axios.post(`${REACT_APP_API_SERVER}/create_post`, formData).then(res => {
            setInterval(function(){
                window.location = "/aboutme";
            }, 1000);
        })
    }
   

    async function collectBioData(bio_data){
        
        const profile_image = await get_image_by_key(bio_data.title, bio_data.img_source);

        set_aboutme_data({
            title: bio_data.title,
            body: bio_data.body,
            timestamp: bio_data.timestamp,
            author: bio_data.author,
            profile_img: bio_data.img_source,
            raw_img_source: REACT_APP_API_SERVER  + profile_image.url
        });

       
    }

    axios.get(`${REACT_APP_API_SERVER}/aboutme`).then(res => {
        if (res.data.bio_data && aboutme_data.title == ""){          

            const bio_data = {
                title: res.data.bio_data.title,
                body: res.data.bio_data.body,
                timestamp: res.data.bio_data.timestamp,
                author: res.data.bio_data.author,
                img_source: res.data.bio_data.img_source,
                raw_img_source: ""
            } 
            
            if (!aboutme_data.raw_img_source)
                collectBioData(bio_data);
        }
        setLoading(false);
      });

    async function get_image_by_key(post_title, image_name){
        console.log("Using image: " + image_name + ", using post title: " + post_title);
        return fetch(`${REACT_APP_API_SERVER}/image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({"file_name" : image_name, "post_title" : post_title})
            }).then(data => data.json())       
    }
   
  return (
    <div className='App'>
        <NavBar />
        <PageHeader page_title = {props.title} />
        {props.loaderGUI(loading)} 
        {!editAboutMeState && <>
            {aboutme_data.title.length > 0 ? <AboutMeCard bio_data = {aboutme_data} openEditWindow={openEditWindow}/> : <div className='row' style={{marginTop: "1%"}}>
                <div className='col-lg-12'>
                    <div className='card' style={{backgroundColor: "white"}}> 
                        <div className='card-header'>
                            <h3>No author biography information available!</h3>
                        </div>
                    </div>
                </div>
                
            </div>}
        </>}
        {editAboutMeState && <div className='row' style={{marginTop: "1%", textAlign: "left"}}>
            <div className='col-lg-12'>
                <div className='card'>
                    <div className='card-title' style={{margin: "3% 2% 2% 3%"}}>
                        <h3>Editing {aboutme_data.title} biography post</h3>
                    </div>
                    <div className='card-body'>
                        <form onSubmit={submitDetails}>                        
                            <div className='row' style={{marginTop: "2%", marginLeft: "2%"}}>
                                <div className='col-lg-1'>
                                    <label>Title: </label>
                                </div>
                                <div className='col-lg-6'>
                                    <input type='text' style={{width: "100%"}} name="title" value={postDetails.title} onChange={handleUpdateDetails}/>
                                </div>
                            </div>

                            <div className='row' style={{marginTop: "2%", marginLeft: "2%"}}>
                                <div className='col-lg-1'>
                                    <label>Description: </label>
                                </div>
                                <div className='col-lg-6'>
                                    <textarea style={{width: "100%"}} name = "post_info" rows="5" cols="50" value={postDetails.body} onChange={handleUpdateDetails}/> <br/>
                                </div>
                            </div>

                            <div className='row' style={{marginTop: "2%", marginLeft: "2%"}}>
                                <div className='col-lg-2  col-md-12'>                                                         
                                    <label>Currently showed image:</label>                                                   
                                </div>
                                <div className='col-lg-4'>                                                         
                                    <img src={aboutme_data.raw_img_source} alt={aboutme_data.title} style={{"width": "7rem", "height": "10rem"}}  className="img-fluid"/><br/>
                                </div>        
                            </div> 
                            <div className='row' style={{marginTop: "2%", marginLeft: "2%"}}>
                                <div className='col-lg-2 col-md-12'>                                                         
                                    <label>Image to replace with:</label>                                                     
                                </div>
                                <div className='col-lg-4'>                                                         
                                    <input style={{width: "100%"}} type="file" className='btn btn-info' name='file_path'  onChange={handleUpdateDetails} accept="image/png, image/jpeg"/><br/>
                                </div>        
                            </div>  

                            <div className='row' style={{marginTop: "15%", marginLeft: "2%", marginBottom: "2%"}}>
                                <div className='col-lg-6'>
                                    <button className='btn btn-warning'>Update</button>
                                    <button style={{marginLeft: "2%"}} className='btn btn-danger' onClick={() => setAboutMeState(false)}>Cancel</button>                                
                                </div>
                            </div>
                          
                        </form>
                    </div>
                </div>
            </div>
        </div>}
        
    </div>
  )
}

export default AboutMe