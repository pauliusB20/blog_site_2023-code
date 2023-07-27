import { useState } from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';
import axios from 'axios';
import configData from "../config.json";

function MainPage(props) {
const REACT_APP_API_SERVER=configData.SERVER_URL;
const [visibilityState, setVisibilityState] = useState('hidden');
const [bioImgLink, setBioImgLink] = useState("");
const [loading, setLoading] = useState(true);


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
async function receiveBioImg(bio_data){
        
    const profile_image = await get_image_by_key(bio_data.title, bio_data.img_source);
    // process.env.REACT_APP_API_SERVER  + profile_image.url
    setBioImgLink(process.env.REACT_APP_API_SERVER  + profile_image.url);
   
    
}
axios.get(`${REACT_APP_API_SERVER}/aboutme`, {
    headers: {
        'Content-Type': 'application/json'  
    }
  }).then(res => {
    if (!res.hasOwnProperty('data')){
        return;
    }

    if (res.data.bio_data && bioImgLink == ""){          

        const bio_data = {
            title: res.data.bio_data.title,            
            img_source: res.data.bio_data.img_source
        } 
        // setLoading(true);
        // setVisibilityState("hidden");
        if (bio_data.img_source)
            receiveBioImg(bio_data);     
            
       
    }
    setVisibilityState('visible');
    setLoading(false);
  }).catch(
    // error => console.log(error)
    function (error){
        setLoading(false);
        console.log(error);
    }
  );

  return (
    <div className='card' style={{backgroundColor: "#f0eff0"}}>  
       {props.loaderGUI(loading)}
        {bioImgLink &&  <div className="row">
            <div style={{margin: "2% auto"}} className='col-lg-3'>
                <img  className='main-page-image' src={bioImgLink}/> 
            </div>                         
        </div>}
       

        <div style={{marginTop: "-5%", visibility: visibilityState}} className="row">
            <Header title={configData.titleMessage} color="black"/> 
        </div>
        
            
        <nav style={{visibility: visibilityState}} className="navbar navbar-expand-lg navbar-light bg-light" >
            <div class="navbar-nav" style={{fontSize: "1.2rem"}}>          
                <li className="nav-item" style={{width: "8rem"}}>
                    <Link className='nav-link navbar-btn' to="/blogs">Blogs</Link>
                </li>
                <li className="nav-item" style={{width: "10rem"}}>
                    <Link className="nav-link navbar-btn" to="/gallery">Gallery</Link>
                </li>
                <li className="nav-item" style={{width: "10rem"}}>
                    <Link className="nav-link navbar-btn" to="/aboutme">About me</Link>
                </li>
            
            </div>
        </nav>
    </div>
  )
}

export default MainPage