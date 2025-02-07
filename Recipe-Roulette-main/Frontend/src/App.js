import React, { useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate} from "react-router-dom";
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import ProfileManagement from './pages/ProfileManagement';
import Posts from './pages/Posts';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import About from './pages/About';
import Search from './pages/Search';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ForgotPassword from './pages/ForgotPassword';
import EnterCode from './pages/EnterCode';
import ChangePassword from './pages/ChangePassword';
import UserProfile from './pages/UserProfile'
import PostDetail from './pages/PostDetail'
import UpdatePost from './pages/UpdatePost';
import Admin from './pages/Admin';
import Report from './pages/Report';

const Layout = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/', '/createAccount', '/ForgotPassword', '/EnterCode', '/ChangePassword']; // Paths where Navbar shouldn't appear

  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
      fetchUserData(storedUserData.split('"')[3]);
    }
    else{
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if(isLoggedIn){
      console.log("The user has been logged in")
    } else{
      console.log("The user is not logged in")
    }
  }, [isLoggedIn]);


  const fetchUserData = async (email) => {
    try {
        const response = await axios.get('http://localhost:8800/userData', {
            params: {
                email: email // Pass the email as a query parameter
            }
        });

        if (response.status === 200) {
            setUserData(response.data);
            setIsLoggedIn(true);
            console.log('User data:', response.data);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
  };

  return (
    <>
      {!hideNavbarPaths.includes(location.pathname) && isLoggedIn && <Navbar userData={userData} setUserData={setUserData} />}
      <div className="page-content">
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/home" element={<Home userData={userData} />} />
              <Route path="/createpost" element={<CreatePost userData={userData}/>} />
              <Route path="/profilemanagement" element={<ProfileManagement />} />
              <Route path="/posts" element={<Posts userData={userData} />} />
              <Route path="/search" element={<Search userData={userData} />} />
              <Route path="/userProfile" element={<UserProfile userData={userData} />} />
              <Route path="/about" element={<About userData={userData} />} />
              <Route path="/posts/:postId" element={<PostDetail userData={userData} />} />
              <Route path="/updatepost/:postId" element={<UpdatePost userData={userData} />} />
              <Route path="/admin" element={<Admin userData={userData} />} />
              <Route path="/report/:postId" element={<Report userData={userData} />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Login userData={userData} fetchUserData={fetchUserData} />} />
              <Route path="/createaccount" element={<CreateAccount />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route path="/enterCode" element={<EnterCode />} />
              <Route path="/changePassword" element={<ChangePassword />} />
            </>
          )}
          {isLoggedIn && <Route path="/" element={<Navigate to="/home" />} />}
        </Routes>
      </div>
    </>
  );
};

function App() {

return (
    <BrowserRouter>
      <Layout /> {/* Wrap Routes in Layout to manage Navbar visibility */}
    </BrowserRouter>
  );
}

export default App;
