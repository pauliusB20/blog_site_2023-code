import React from 'react'
import NavBar from './NavBar'
import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
import configData from "../config.json";


function Login(props) {
    const REACT_APP_API_SERVER=configData.SERVER_URL;
    const [userDetails, setUserDetails] = useState({
        username: "",
        password: ""
    });

    // const navigate_user = useNavigate();

    async function loginUser(credentials) {
        return fetch(`${REACT_APP_API_SERVER}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            
          },
          body: JSON.stringify(credentials)
        }).then(data => data.json())
       }

   async function submit_login_data(event){
        event.preventDefault();
        console.log(userDetails);

        var received_data = await loginUser({username: userDetails.username, password: userDetails.password});
        console.log(received_data);
        if (received_data.hasOwnProperty('token'))
        {
            console.log(`SUCCESS: User ${userDetails.username} is logged in!`);
            localStorage.setItem('token', received_data.token);
            localStorage.setItem('username', received_data.user_details.username);
            localStorage.setItem('email', received_data.user_details.email);
            // console.log(`Using user data: ${received_data.user_details}`)

            setInterval(function() {
                window.location = "/blogs"; //NOTE: Update to REACT way of navigating!
            }, 1000)
        }
        else
        {
            props.displayToast(received_data.msg, "error");
            console.log("ERROR: Didn't received login token");
        }
        // console.log(received_data);
    }
    
    function updateUserDetails(event){
        const newValue = event.target.value;
        const name = event.target.name;
    
        setUserDetails(prevValue => {
            if (name === "username"){
                return {
                    username: newValue,
                    password: prevValue.password
                }
            }
            else if (name === "password"){
                return {
                    username: prevValue.username,
                    password: newValue
                }
            }
        })
        
        
    }
  return (
    <div className='App'>
        <NavBar />
        {props.renderToast()}
        <div className='row' style={{marginTop: "2%"}}>
            <div className='col-sm'>
                <div className='card'>
                    <div className='card-title'>
                        <h2>{props.title}</h2>
                    </div>
                    
                    <div className='card-body'>
                        <form onSubmit={submit_login_data}>
                            <label style = {{margin: "0px 10px 10px 0px"}}>
                                Username:
                            </label>

                            <input type="text" name = "username" value={userDetails.username} onChange={updateUserDetails}/><br/>

                            <label style = {{margin: "0px 10px 10px 0px"}}>
                                Password:
                            </label>

                            <input type="password" name = "password" value={userDetails.password} onChange={updateUserDetails}/><br/>

                            <input style={{color: "white"}} className='btn bg-warning' type="submit" name = "Submit"/>
                        </form>
                    </div>
                    
                </div>
                
            </div>

        </div>
    
    </div>
  )
}

export default Login