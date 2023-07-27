import React from 'react';
import NewsCard from './NewsCard';


function SearchResults(props) {
  //create a new array by filtering the original array
  const filteredData = props.web_posts.filter((el) => {
    //if no input the return the original
        if (props.input === '') {
            return el;
        }
        //return the item which contains the user input
        else {
            return el.title.toLowerCase().includes(props.input)
        }
    })
    return (
        <div className='row' style={{marginTop: "2%"}}>
                        {filteredData.map((post) => (
                            <NewsCard 
                                key={post.id} 
                                title={post.title} 
                                body={post.body} 
                                author={post.author} 
                                post_date={post.date}
                                display_post_info={props.display_post_info}
                                openEditWindow={props.openEditWindow}
                            />
                        ))}
        </div>
)
}

export default SearchResults