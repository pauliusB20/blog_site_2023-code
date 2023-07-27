import {useState} from 'react'
import TextField from "@mui/material/TextField";
import NavBar from './NavBar'
import axios from 'axios';
import PageHeader from './PageHeader';
import SearchResults from './SearchResults';
import configData from "../config.json";

function Blogs(props) {
  const [loading, setLoading] = useState(true);
  const REACT_APP_API_SERVER=configData.SERVER_URL;
  const [useInputText, setUseInputText] = useState("");  
  const [web_news_posts, set_web_news_posts] = useState([]);
  const [showPostInfo, setShowPostInfo] = useState(false);
  const [showPostEdit, setShowPostEdit] = useState(false);
  const [oldPostTitle, setOldPostTitle] = useState("");
  const [postInfoShow, setPostInfoShow] = useState({
    title: "",
    body: "",
    author: "",
    post_date: ""
  });
  const [editPost, setEditPost] = useState({
    title: "",
    body: "",
    author: "",
    post_date: ""
  })

  let inputHandler = (e) => {
    var target_value = e.target.value.toLowerCase();
    setUseInputText(target_value);
  }

  function handleEditInput(event){
    const event_name = event.target.name;
    const event_value = event.target.value;
    
    setEditPost(prevValue => {
      if (event_name === "title"){
        return {
          title: event_value,
          body: prevValue.body
        }
      }
      if (event_name === "post_info"){
        return {
          title: prevValue.title,
          body: event_value
        }
      }
    })
  }
  function submitPostEdits(){
    const editForm = new FormData();
    
    if (oldPostTitle !== editPost.title){
      editForm.append("old_title", oldPostTitle);
      editForm.append("new_title", editPost.title);
    }
    else{
      editForm.append("title", editPost.title);
    }
    editForm.append("body", editPost.body);

    axios.post(`${REACT_APP_API_SERVER}/edit_news`, editForm).then((res) => {
      setInterval(function() {
        window.location = "/blogs";
      }, 1000)
    })
  }

  function display_post_info(post){
    setShowPostInfo(true);
    setPostInfoShow({
        title: post.title,
        body: post.body,
        author: post.author,
        post_date: post.post_date
    })

  }

  function return_to_main_page(){
    setShowPostInfo(false); 
    setUseInputText("");
  }

  function openEditWindow(post){
    setShowPostEdit(true);
    setPostInfoShow({
      title: post.title,
      body: post.body,
      author: post.author
    })
    setEditPost({
      title: post.title,
      body: post.body
    })
    setOldPostTitle(post.title);
  }
  function closeEditWindow(){
    setShowPostEdit(false);    
  }  

  axios.get(`${REACT_APP_API_SERVER}/news`).then(res => {
    if (res.data.news_posts.length > 0 && web_news_posts.length === 0) {
        const news_posts_display = [];
        const news_posts_raw = res.data.news_posts;

        for (var post in news_posts_raw){
            const news_post = {
                id: post,
                title: news_posts_raw[post].title,
                body: news_posts_raw[post].body,
                author: news_posts_raw[post].author_username,
                date: news_posts_raw[post].post_date
            }
            news_posts_display.push(news_post);
        }
        
        set_web_news_posts(news_posts_display);
    }
    setLoading(false);
  });

  return (
    <div className="App">
        <NavBar />       
        <PageHeader page_title = {props.title}/>
        {props.loaderGUI(loading)} 
      
        <div className='row'>
          <div className='col-lg-12'>
              <div className='card' style={{marginTop: "1%"}}>
                  <div className='card-body' >                     
                      
                      {(!showPostInfo && !showPostEdit) && (
                           <>
                            <TextField
                                id="outlined-basic"
                                onChange={inputHandler}
                                variant="outlined"
                                fullWidth
                                label="Search"
                              />
                              <SearchResults input={useInputText} web_posts={web_news_posts} display_post_info={display_post_info} openEditWindow={openEditWindow}/>
                            </>
                        )}
                       { showPostInfo && (
                          <div className='col-lg-12'>
                            <div className='card bg-outline-primary' style={{textAlign: "left"}}>
                                    <div className='card-title news-post-title'>
                                        <h2>{postInfoShow.title}</h2>
                                    </div>
                                    <div className='card-body bg-light'>
                                        <pre style={{margin: "0", whiteSpace: "pre-line"}}><p>{postInfoShow.body}</p></pre>
                                    </div>
                                    <div className='footer' style={{padding: "1% 1%"}}>
                                        <p>Posted by {postInfoShow.author} on {postInfoShow.post_date}</p>
                                        <button className='btn btn-warning' onClick={() => return_to_main_page() }>Return to Main Page</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {
                          showPostEdit && (
                            <div className='row'>
                                <div className='col-lg-12'>
                                    <div className='card'>
                                      <div className='card-header'>
                                          <h3 style={{textAlign: "center"}}>Editing blog post: {postInfoShow.title}</h3>
                                      </div>
                                      <div className='card-body' style={{textAlign: "left"}}>
                                        <form onSubmit={submitPostEdits}>
                                          <div className='row' style={{marginTop: "2%"}}>
                                              <div className='col-lg-2'>
                                                  <label>Title:</label>
                                              </div>
                                              <div className='col-lg-4'>
                                                  <input value={editPost.title} type='text' name="title" style={{width: "100%"}} onChange={handleEditInput}/>
                                              </div>
                                          </div>

                                          <div className='row' style={{marginTop: "2%"}}>
                                              <div className='col-lg-2'>
                                                  <label>Body:</label>
                                              </div>
                                              <div className='col-lg-4'>
                                                  <textarea value={editPost.body} name = "post_info" style={{width: "100%"}} placeholder='Write info text...' rows="5" cols="50" onChange={handleEditInput}/> <br/>
                                              </div>
                                          </div>

                                          <div className='row' style={{marginTop: "2%"}}>
                                              <div className='col-lg-6'>
                                                <button className='btn btn-warning'>Submit</button>
                                                <button className='btn btn-danger' style={{margin: "0% 2%"}} onClick={() => closeEditWindow()}>Cancel</button>
                                              </div>                                            
                                          </div>
                                        </form> 
                                      </div>                                     
                                    </div>
                                </div>
                            </div>
                          )
                        }
                  </div>
              </div>
           </div>
        </div>
    </div>
  )
}

export default Blogs