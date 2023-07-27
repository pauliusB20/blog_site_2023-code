import { Link, useLocation } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

var login_token = localStorage.getItem('token');

function check_login_status(all_link_css){
  if (login_token){
    return (
      <Link className={all_link_css['/profile']} to="/profile">Profile</Link>
    )    
  }
  else{
    return null
  }
}


function NavBar() {
  const location = useLocation();

  
  var link_css_classes = {
                          "/blogs" : "nav-link navbar-btn", 
                          "/gallery" : "nav-link navbar-btn", 
                          "/login" : "nav-link navbar-btn", 
                          "/profile" : "nav-link navbar-btn",
                          "/aboutme" : "nav-link navbar-btn"
                        };

  link_css_classes[location.pathname] = link_css_classes[location.pathname] + " active";

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Brand>
   
        <Link style={{fontSize: "1.5rem"}} className="navbar-brand" to="/">Hobby&IT</Link>
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto">
          <Link className={link_css_classes["/blogs"]} to="/blogs">Blogs</Link>
          <Link className={link_css_classes["/gallery"]} to="/gallery">Gallery</Link>
          <Link className={link_css_classes["/aboutme"]} to="/aboutme">About</Link>
        
        {check_login_status(link_css_classes)}
                
      </Nav>
    
    </Navbar.Collapse>
  </Navbar>  
    // <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    //     <div class="navbar-nav">
    //       <Link style={{fontSize: "1.5rem"}} className="navbar-brand" to="/">Hobby&IT</Link>
    //       <li className="nav-item">
    //         <Link className={link_css_classes["/blogs"]} to="/blogs">Blogs</Link>
    //       </li>
    //       <li className="nav-item">
    //         <Link className={link_css_classes["/gallery"]} to="/gallery">Gallery</Link>
    //       </li>
    //       <li className="nav-item">
    //         <Link className={link_css_classes["/aboutme"]} to="/aboutme">About</Link>
    //       </li>
    //       {/* {account_management_btn(link_css_classes)} */}
    //       {check_login_status(link_css_classes)}
    //     </div>
    // </nav>
  )
}

export default NavBar