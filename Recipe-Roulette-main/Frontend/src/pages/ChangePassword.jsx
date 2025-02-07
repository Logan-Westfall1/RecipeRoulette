import React, { useState } from "react";
import "../App.css" // Update the path if your CSS file is located elsewhere
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChangePassword(){
    const [newPass, setPass] = useState('');
    const [confPass, checkPass] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(newPass === confPass){
                alert('Password Changed Successfully');
                navigate('/');
            } else {
                alert('Passwords do not match') 
            }
        } catch (error) {
            
        }
    //todo later

    }
    return(
        <div>
            <div className='page-background'></div>
            <div className='change-password'>
                <h2>New Password</h2>
                <form id="changePassword" onSubmit={handleSubmit}>
                    <div id="textInput">
                        <input 
                            type="password" 
                            id="newPassword" 
                            placeholder="New Password" 
                            value={newPass} 
                            required
                            onChange={(e) => setPass(e.target.value)}
                        />
                    </div>
                    <h2>Confirm Password</h2>
                    <div id="textInput">
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            placeholder="Confirm Password" 
                            value={confPass} 
                            required
                            onChange={(e) => checkPass(e.target.value)}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}
export default ChangePassword;