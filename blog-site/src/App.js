import './App.css';
import './css/bootstrap.css';
import './css/bootstrap-reboot.css';
import './css/bootstrap.rtl.css';
import './css/bootstrap-grid.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blogs from './components/Blogs';
import Login from './components/Login';
import Register from './components/Register';
import Gallery from './components/Gallery';
import Profile from './components/Profile';
import MainPage from './components/MainPage';
import AboutMe from './components/AboutMe';
import RingLoader from "react-spinners/RingLoader";
import Error404 from './components/Error404';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {  
  function loaderGUI(loading){
    const override = {
      display: "block",
      margin: "0 auto",
      borderColor: "grey",
      borderWidth: "10 px",
      position: "fixed",
      zIndex: "1"
    };
    return (
      <RingLoader
        color="#000000"
        loading={loading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="hb-loader"
      />
    )
  }

  function displayToast(message, msgType){
        
    switch(msgType){
        case "error":
            toast.error(message)
            break;
        case "info":
            toast(message)
            break;
        case "success":
            toast.success(message)
            break;
    }
  } 
  function renderToast(){
    return <ToastContainer autoClose={3000} theme='colored'/>
  }

  return (
    <div className='container'>
   
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage loaderGUI={loaderGUI}/>} />
        <Route path='/gallery' element={<Gallery loaderGUI={loaderGUI} title="3D Art Gallery"/>} />
        {process.env.NODE_ENV === 'development' && (<>
          <Route path="/register" element={<Register title="Register" renderToast={renderToast} displayToast={displayToast} />} />
          <Route path="/login" element={<Login title="Login" renderToast={renderToast} displayToast={displayToast}/>} />
          <Route path="/profile" element={<Profile title="profile page" renderToast={renderToast} displayToast={displayToast}/>} />
        </>)}  
        {process.env.NODE_ENV !== 'development' && (
            <>
              <Route path="/profile" element={<Error404 />}/>
              <Route path="/login" element={<Error404 />}/>
              <Route path="/register" element={<Error404 />}/>
            </>
          )
        }  
      
        <Route path="/blogs" element={<Blogs loaderGUI={loaderGUI} title="Blogs"/>} />
        <Route path="/aboutme" element={<AboutMe loaderGUI={loaderGUI} title="About Me"/>} />
          {/* <Route index element={<MainPage />} />
          <Route path="/login" element={<Login />} /> */}
          {/* <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} /> */}
        
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
