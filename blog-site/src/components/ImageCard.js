import {useState} from 'react'
import Modal from 'react-modal';
import axios from 'axios';

function ImageCard(props) {
 
  Modal.setAppElement('#root');

  return (
     <div className="col-lg-3 col-md-4" style={{marginTop: "1%"}}>                    
        <div className='card text-white bg-secondary gallery-article-card'>
            <div style={{width: "80%",  margin: "5% auto"}}>
              <img src={props.source_url} alt={props.title} className='art-article-thumbnail'/>
            </div>
            
            <div className='card-body'>
                <h2 className='card-title gallery-article-card_title' style={props.title.length > 8 ? {fontSize: "1.75rem"} : {fontSize: "2rem"}}>{props.title}</h2>
                <button className='btn btn-info'style={{margin: "15% 0% 5% 0%"}} onClick={() => props.showImageWindow(props)}>View</button>
                <p>Posted by {props.author}</p><br/>
                {/* <p className='card-text'>{props.img_info}</p> */}               
            </div>
        </div>
    </div>
  )
}

export default ImageCard