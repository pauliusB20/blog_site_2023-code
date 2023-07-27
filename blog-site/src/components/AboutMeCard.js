import axios from "axios"
import configData from "../config.json";


function AboutMeCard(props) {
  function deletePost(){
    const REACT_APP_API_SERVER=configData.SERVER_URL;
    const formData = new FormData();
    formData.append("title", props.bio_data.title);
    formData.append("author", localStorage.getItem("username"));

    axios.post(`${REACT_APP_API_SERVER}/delete_post`, formData).then((res) => {
        const delete_status = res.data;
        if (delete_status.status === "OK"){
            setTimeout(function() {
                window.location = "/aboutme";
            }, 1000);
        }
    }).catch(error => console.log(error));
  }
  

  return (
    <div className="row" style={{marginTop: "1%"}}> 
        <div className="col-lg-12"> 
            <div className="card"  style={{textAlign: "left"}}>                
                <div className="row">
                
                    <img className='main-page-image_bio col-lg-2' src={props.bio_data.raw_img_source}/>

                    <div className="col-lg-9" style={{marginTop: "2%"}}>
                        <div className="card card-ht-text" style={{backgroundColor: "#e8e9eb"}}>
                            <h3 style={{textAlign: "left"}}>{props.bio_data.title}</h3>
                            <pre style={{margin: "0", whiteSpace: "pre-line"}}>
                                <p style={{textAlign: "left"}}>{props.bio_data.body}</p>
                            </pre>
                            {localStorage.getItem('username') == props.bio_data.author && 
                                <div className="col-lg-12" style={{marginTop: "15%"}}>
                                    <button className="btn btn-warning" onClick={() => props.openEditWindow()}>Edit</button>
                                    <button style={{marginLeft: "0.5%"}} className="btn btn-danger" onClick={() => deletePost()}>Delete</button>
                                </div>  
                            } 
                        </div>
                    </div>                   
                </div>
              
                <div className="row">
                    <div className="col-lg-12">
                        <p style={{padding: "2% 2% 2% 2%"}}>Created on {props.bio_data.timestamp}</p>
                    </div>
                </div>              
                            
            </div>                
        </div> 
    </div> 
   
  )
}

export default AboutMeCard