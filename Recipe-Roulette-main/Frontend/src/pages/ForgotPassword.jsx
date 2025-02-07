import React, { useState } from "react";
import "../App.css" // Update the path if your CSS file is located elsewhere
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword(){
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(1==1){
                alert('Code Sent');
                navigate('/EnterCode');
            }
        } catch (error) {
            
        }
    //todo later

    }
    return(
        <div>
            <div className='page-background'></div>
            <div className='forgot-password'>
                <h1>Enter the Email You Used When Creating The Account</h1>
                <form id="emailCheck" onSubmit={handleSubmit}>
                    <div id="textInput">
                        <input 
                            type="email" 
                            id="checkEmail" 
                            placeholder="Email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}
export default ForgotPassword;