import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login({ userData, fetchUserData }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook

    
    useEffect(() => {
        console.log('Stored userData:', userData); // Log userData after it's updated
    }, [userData]); // This useEffect will be triggered whenever userData changes


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Using axios to make the HTTP POST request
            const response = await axios.post('http://localhost:8800/login', {
                email,
                password,
            });

            if (response.status === 200) {
                console.log('Login successful:', response.data);
                fetchUserData(email);
                alert('Login successful!');
                navigate('/home');  
            } else {
                // Handle non-200 responses
                console.error('Login failed:', response.data.message);
                alert('Incorrect login information: ' + response.data.message);
            }
        } catch (error) {
            // Error handling
            if (error.response) {
                console.error('Login failed:', error.response.data);
                alert('Incorrect login information: ' + error.response.data.message);
            } else if (error.request) {
                console.error('Error:', error.request);
            } else {
                console.error('Error', error.message);
            }
            alert('An error occurred during login. Please try again later.');
        }
    };


    return (
        <div>
            <div className='page-background'></div>
            <div className="login">
                <h1>Welcome to Recipe Roulette</h1>
                <h2>Login</h2>
                <form id="loginForm" onSubmit={handleSubmit}>
                    <div id="textInput">
                        <input 
                            type="email" 
                            id="loginEmail" 
                            placeholder="Email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div id="textInput">
                        <input 
                            type="password" 
                            id="loginPassword" 
                            placeholder="Password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" id="loginButton">Log In</button>
                </form>
                <p>Don't have an account?</p>
                <a id="createAccountLink" href="/createAccount">Create an Account</a>
                <h1></h1>
                <a id="forgotPasswordLink" href="/ForgotPassword">Forgot Your Password?</a>
            </div>
        </div>
    );
}

export default Login;
