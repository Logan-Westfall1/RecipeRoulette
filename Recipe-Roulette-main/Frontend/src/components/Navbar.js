import React, { useEffect, useState } from "react";
import { Link, useNavigate} from 'react-router-dom';

function Navbar({ userData, setUserData}) {
  const [userDisplayName, setUserDisplayName] = useState("User");
  const [pfpSRC, setPfpSRC] = useState("/path/to/default/profile/image.jpg");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User data updated -Navbar:', userData); // Log userData after it's updated
    if (userData && userData.length > 0) {
      setPfpSRC(userData[0].profilePicture);
      setUserDisplayName(userData[0].displayName);
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData, userDisplayName]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserData(null);

    setPfpSRC("/path/to/default/profile/image.jpg");
    setUserDisplayName("User");
    setDropdownOpen(false);

    console.log("User has logged out");
    navigate("/");
    window.location.reload();
  };

  const goToProfile = () => {
    navigate("/UserProfile"); 
    setDropdownOpen(false); 
  };

  const darkMode = () => {
    let element = document.body;
    element.classList.toggle("dark-mode");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">Recipe Roulette</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/createpost">Create Post</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/posts">Posts</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profilemanagement">Profile Management</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            {userData && userData[0].isAdmin.data[0] === 1 && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
            )}
            <li className="nav-item">
              <button onClick={darkMode}>Switch Mode</button>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" onClick={toggleDropdown} aria-expanded={dropdownOpen}>
                <img src={`http://localhost:8800/uploads/` + pfpSRC} alt="Profile" className="rounded-circle" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                {userDisplayName}
              </a>
              <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdownMenuLink">
              <li><button className="dropdown-item" onClick={goToProfile}>My Profile</button></li>
                <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
