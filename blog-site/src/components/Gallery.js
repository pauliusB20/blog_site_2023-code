import { useState } from 'react'
import ImageCard from './ImageCard.js';
import NavBar from './NavBar.js';
import axios from 'axios';
import PageHeader from './PageHeader.js';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import configData from "../config.json";

function Gallery(props) {
    const REACT_APP_API_SERVER=configData.SERVER_URL;
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [images_from_db, set_images_from_db] = useState([])
    const [imagesDisplayed, setImagesDisplayed] = useState(false);
    const [displayImgList, setDisplayImgList] = useState(true);
    const [modalIsOpen, setIsOpen] = useState(false);
    const [old_post_title, set_old_post_title] = useState("");
    const [showEditWindow, setShowEditWindow] = useState(false);
    const [selectedCarouselItemIndex, setSelectedCarouselItemIndex] = useState(0);
    const [selectedImageCard, setSelectedImageCard] = useState({
        source_url: "",
        title: "",
        img_info: "",
        author: "",
        post_date: ""
    });
    const valid_image_formats = ["image/png", "image/jpeg"]
    const [postDetails, setPostDetails] = useState({
        title: "",
        body: "",
        file_details: null,
        file_path: ""
      });

      const close_img_btn = (
        <div>
            <button style={{
                position: "relative", 
                zIndex: "1", 
                color: "white", 
                fontSize: "2rem",
                marginTop: "-20%",
                marginLeft: "20%"}} 
            className='btn btn-lg'>
                X
            </button>
        </div>
      );

    function showImageInfoWindow(art_post_details){
        setSelectedImageCard({
            source_url: art_post_details.source_url,
            title: art_post_details.title,
            img_info: art_post_details.img_info,
            author: art_post_details.author,
            post_date: art_post_details.post_date
        });
        setDisplayImgList(false);
        window.scrollTo(0, 0);
    }
    function closeImageInfoWindow(){
        setShowEditWindow(false);
        setDisplayImgList(true);
    }
    function openModel(){
        setIsOpen(true);
    }
    function closeModal(){
        console.log("Closing image modal...");
        setIsOpen(false);
    }    
    function openEditWindow(){
        setShowEditWindow(true);
        set_old_post_title(selectedImageCard.title);
        setPostDetails({
            title: selectedImageCard.title,
            body: selectedImageCard.img_info,
            file_details: selectedImageCard.source_url,
            file_path: ""
        })
    }
    function closeEditWindow(){
        setShowEditWindow(false);
        setDisplayImgList(true);
    }

    function sendEditPostChanges(event){
        const formData = new FormData();
        formData.append("post_info", postDetails.body);
        formData.append("title", postDetails.title);
        formData.append("action", "update");
        formData.append('author', localStorage.getItem('username'));

        if (postDetails.file_details)
            formData.append("file", postDetails.file_details);

        if (old_post_title !== postDetails.title){
            formData.append("old_post_title", old_post_title);
        }

        axios.post(`${REACT_APP_API_SERVER}/create_post`, formData)
            .then((res) => {
                // const submit_res = res;
                setInterval(function(){
                    window.location = "/gallery";
                }, 1000)

            }).catch((error) => console.log("Can't submit new art post details due to error: " + error))
    }

    function openImageInfo(imageItem){
        setDisplayImgList(false);
        setSelectedImageCard({
            source_url: imageItem.img_url,
            title: imageItem.img_title,
            img_info: imageItem.img_info,
            author: imageItem.author,
            post_date: imageItem.post_date
        })
    }

    function handleEditPost(event){
        const elem_name = event.target.name;
        const elem_value = event.target.value;

        setPostDetails(prevValue => {
            if (elem_name === "post_title"){
                return {
                    title: elem_value,
                    body: prevValue.body,
                    file_path: prevValue.file_path
                }
            }
            else if (elem_name === "post_info"){
                return {
                    title: prevValue.title,
                    body: elem_value,
                    file_path: prevValue.file_path
                }
            }
            else if (elem_name === "file_path"){
                var file_to_send = event.target.files[0];
                if (!valid_image_formats.includes(file_to_send.type))
                {
                  alert("ERROR: Invalid file selected!\nImage files(*.png, *.jpg, *.jfif, *.pjpg) are supported for the upload!");
                  window.location.reload();
                }        
                return {
                  title: prevValue.title,
                  file_path: elem_value,
                  body: prevValue.body,
                  file_details: file_to_send
                }
            }
        })
    }

    function create_img_card(img_record){
        // console.log(process.env.PUBLIC_URL + img_record.img_url);
        return (
           <ImageCard 
                key = {img_record.id} 
                source_url={img_record.img_url} 
                title={img_record.img_title} 
                img_info={img_record.img_info}
                author={img_record.author}
                post_date={img_record.post_date}
                showImageWindow = {showImageInfoWindow}
            />
        )
    } 

    // Method for opening image info window in the carousel
    function createCarouselItem(dataItem) {
        
        return (
            <div>
                <img 
                    id={'corousel-item-' + dataItem.id}
                    style={{pointerEvents: "all", padding: "0.5%"}}
                    src={dataItem.img_url} 
                />
                {/* <button className="legend" onClick={() => openImageInfo(dataItem)}>View</button>      */}
            </div>
            
        )
    }

    async function get_all_images(){
        const image_posts = [];
        axios.get(`${REACT_APP_API_SERVER}/gallery_data`)
        .then(async function(res) {
        console.log("Collected post data");
        
        console.log(res);
        const posts_info = res.data.posts;
        for (var post in posts_info){
            var image_name = posts_info[post].image;
            const raw_image = await get_image_by_key(posts_info[post].title, image_name);
            const image_url = REACT_APP_API_SERVER  + raw_image.url;
            image_posts.push({
                id: post,
                img_title: posts_info[post].title,
                img_info: posts_info[post].body,
                img_url: image_url,
                author: posts_info[post].author,
                post_date: posts_info[post].date
            })
            // console.log();
        }
        set_images_from_db(image_posts);
        setImagesDisplayed(true);
        setLoading(false);
        setLoaded(true);
        // const raw_image = await get_image_by_key();
        // console.log(raw_image);
        // if (!testImage)
        //     setTestImage(raw_image)     
                   
        })
        .catch((err) => console.log("Post collection process failed!. Error: " + err));
    }


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

    async function get_post_data() { 
        return await get_all_images()
    }

    async function deletePost(){
        const formData = new FormData();
        formData.append("title", selectedImageCard.title);
        formData.append("author", localStorage.getItem("username"));

        axios.post(`${REACT_APP_API_SERVER}/delete_post`, formData)
            .then((res) => {
                const delete_status = res.data;
                console.log(delete_status);
                if (delete_status.status === "OK"){
                    setInterval(function(){
                        window.location = "/gallery";
                      }, 1000);
                }
            })
    }
 
 if (!loading && !loaded)
    setLoading(true);

 if (!imagesDisplayed)
 {   
    get_post_data();
 }

  return (
    <div id="gallery_window" className="App">          
        <NavBar />
        <PageHeader page_title = {props.title} />
        {(displayImgList && images_from_db.length > 0) && <div className='row' style={{marginTop: "1%"}}>
            <div className='col-lg-6 mx-auto'>             
                <div className='card'>
                    <Carousel autoFocus={true} showArrows={true} showThumbs={true} onChange={function(itemIndex){
                       setSelectedCarouselItemIndex(itemIndex);
                    }}>
                    {images_from_db.map(createCarouselItem)}       
                    </Carousel>
                </div>                
            </div>
        </div>}  
        {(displayImgList && images_from_db.length > 0) &&  <div className='row'>        
            <div className='col-lg-6 mx-auto'>
                <div className='card'>
                    <button className='btn btn-lg btn-info' style={{margin: "1%"}} onClick={() => openImageInfo(images_from_db[selectedCarouselItemIndex])}>View</button>
                </div>
            </div>
        </div>}  
       
        <div className='row' style={{marginTop: "1%"}}>
        {props.loaderGUI(loading)}  
            <div className='col-12'>
                <div className='card' style={{padding: "1% 1%"}}>
                    <div className='row'>            
                        {displayImgList ? images_from_db.length > 0 ? images_from_db.map(create_img_card) : <div className='row'>
                            <div className='col-12'>
                                <div className='card' style={{"padding" : "1rem"}}>
                                    <h2 className='card-title'>No available posts to show!</h2>
                                </div>
                            </div>
                        </div> : null}
                        {(!displayImgList && !showEditWindow) && <div className='col-12'>
                            <div className='card bg-light box-shadow' style={{"padding" : "1rem"}}>
                                {/* Picked gallery card */}
                                
                                <div className='row' style={{marginTop: "1%"}}>
                                    <img className="col-lg-4 gallery-article-img" 
                                            alt={selectedImageCard.title} src={selectedImageCard.source_url} 
                                            onClick={() => openModel()}/>
                                            <Modal
                                                open={modalIsOpen}
                                                onClose={() => closeModal()}                                                            
                                                classNames={{
                                                    overlay: 'customOverlay',
                                                    modal: 'customModal'
                                                }}
                                                closeIcon={close_img_btn}
                                                center
                                                >
                                                <img className='gallery-item-img' src={selectedImageCard.source_url} alt={selectedImageCard.title} /> 
                                            </Modal>

                                    <div className="col-lg-8">
                                        <div className='card gallery-card border-light' style={{backgroundColor: "#e8e9eb"}}>
                                            <h2 style={{textAlign: "left"}}>{selectedImageCard.title}</h2>
                                            <pre style={{margin: "0", whiteSpace: "pre-line"}}>
                                                <p style={{textAlign: "justify", marginTop: "2%", height: "100%"}}>{selectedImageCard.img_info}</p>
                                            </pre>                                                
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className='row' style={{marginTop: "10%"}}>
                                    <div className='col-lg-12'>
                                     <button style={{float: "left"}} className='btn btn-info' onClick={() => closeImageInfoWindow()}>Return</button>            
                                    {localStorage.getItem("token") && 
                                        <>                                           
                                            <button style={{float: "left", marginLeft: "2%"}} className='btn btn-warning' onClick={() => openEditWindow()}>Edit</button>
                                            <button style={{float: "left", marginLeft: "2%"}} className='btn btn-danger' onClick={() => deletePost()}>Delete</button>
                                        </>
                                        } 
                                            
                                    </div>                                                    
                                </div>                               
                                
                            </div>
                        </div>}
                        {/* Edit form */}
                        {showEditWindow && <div className='row'>
                            <div className='col-lg-12'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h3 style={{textAlign: "center"}}>Editing art post: {selectedImageCard.title}</h3>
                                    </div>
                                    <div className='card-body' style={{textAlign: "left"}}>
                                        <form onSubmit={sendEditPostChanges}>  
                                                <div className='row' style={{marginTop: "2%"}}>
                                                    <div className='col-lg-2'>
                                                        <label>Title: </label>                                                
                                                    </div>
                                                    <div className='col-lg-4'>
                                                         <input type="text" style={{width: "100%"}} name = "post_title" placeholder='Write title...' value = {postDetails.title} onChange={handleEditPost}/>    
                                                    </div>                                          
                                                </div>                                               
                                                <div className='row' style={{marginTop: "2%"}}>
                                                    <div className='col-lg-2  col-md-12'>                                                         
                                                        <label>Current showed image:</label>                                                   
                                                    </div>
                                                    <div className='col-lg-4'>                                                         
                                                        <img src={selectedImageCard.source_url} alt={selectedImageCard.title} style={{"width": "15rem", "height": "10rem"}}  className="img-fluid"/><br/>
                                                    </div>        
                                                </div>      
                                                <div className='row' style={{marginTop: "2%"}}>
                                                    <div className='col-lg-2 col-md-12'>                                                         
                                                        <label>Image to replace with:</label>                                                     
                                                    </div>
                                                    <div className='col-lg-4'>                                                         
                                                        <input style={{width: "100%"}} type="file" className='btn btn-info' name='file_path' value = {postDetails.file_path} onChange={handleEditPost} accept="image/png, image/jpeg"/><br/>
                                                    </div>        
                                                </div>
                                                <div className='row' style={{marginTop: "2%"}}>
                                                    <div className='col-lg-2'>
                                                        <label>Description: </label>                                                    
                                                    </div>
                                                    <div className='col-lg-4'>
                                                        <textarea name = "post_info" style={{width: "100%"}} placeholder='Write info text...' rows="5" cols="50" value = {postDetails.body} onChange={handleEditPost}/> <br/>
                                                        
                                                    </div>                                            
                                                </div>                                               
                                                <div className='row' style={{marginTop: "2%"}}>
                                                    <div className='col-lg-6'>               
                                                        <button className='btn btn-danger' style={{margin: "0.5%"}} onClick={() => closeEditWindow()}>Cancel</button>                                                                                              
                                                        <button className='btn btn-warning' style={{margin: "0.5%"}}>Update</button>                                                         
                                                    </div>
                                                </div>
                                                
                                        </form>
                                    </div>                                    
                                </div>
                            </div>
                        </div>}
                       
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Gallery