import {useState} from 'react';
import NavBar from './NavBar';
import configData from "../config.json";


async function registerUser(credentials) {
    const REACT_APP_API_SERVER=configData.SERVER_URL;
    return fetch(`${REACT_APP_API_SERVER}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        
      },
      body: JSON.stringify(credentials)
    }).then(data => data.json())
   }

function Register(props) {
   
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    email: ""
  }) 

  function updateDetails(event){
    const value_name = event.target.name;
    const value = event.target.value;

    setUserDetails(prevValue => {
        var newUserDetails = {
            username: prevValue.username,
            password: prevValue.password,
            email: prevValue.email
        }

        if (value_name === "username_field"){
            newUserDetails.username = value;
        }
        else if (value_name === "password_field"){
            newUserDetails.password = value;
        }
        else if (value_name === "email_field"){
            newUserDetails.email = value;
        }

        return newUserDetails;
    })
  }

  async function submitUserDetails(event){
    event.preventDefault();
    console.log(userDetails);

    //Sending user data logic
    const registerStatus = await registerUser(userDetails);

    if (registerStatus.hasOwnProperty('token'))
    {
        console.log(registerStatus);
        
        localStorage.setItem('token', registerStatus.token);
        localStorage.setItem('username', userDetails.username);
        localStorage.setItem('email', userDetails.email);
        console.log(`User username=${userDetails.username} is registered!`);
        setInterval(function() {
            window.location = "/"; //NOTE: Update to REACT way of navigating!
        }, 1000)
    }
    else{
        console.log("Error with reegistration process!");
        // console.log(registerStatus);
        props.displayToast(registerStatus.msg, "error");
    }
  }

  return (
    <div className='App'>
        <NavBar />
        {props.renderToast()}
        <div className='row'>
            <div className='col-sm'>
                <div className='card'>
                    <div className='card-title'>
                        <h2>{props.title}</h2>
                    </div>
                    
                    <div className='card-body'>
                        <form onSubmit={submitUserDetails}>
                            <label style = {{margin: "0px 10px 10px 0px"}}>
                                Username:
                            </label>
                            <input type="text" name = "username_field" value={userDetails.username} onChange={updateDetails}/><br/>

                            <label style = {{margin: "0px 10px 10px 0px"}}>
                                Password:
                            </label>
                            <input type="password" name = "password_field" value={userDetails.password} onChange={updateDetails}/><br/>

                            <label style = {{margin: "0px 10px 10px 0px"}}>
                                Email:
                            </label>
                            <input type="email" name = "email_field" email={userDetails.email} onChange={updateDetails}/><br/>

                            <input style={{color: "white"}} className='btn bg-warning' type="submit" name = "Submit"/>
                        </form>
                    </div>
                    
                </div>
                
            </div>

        </div>
    
    </div>
  )
}

export default Register