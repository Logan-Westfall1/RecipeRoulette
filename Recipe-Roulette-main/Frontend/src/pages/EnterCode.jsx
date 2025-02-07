import React, { useState } from "react";
import "../App.css" // Update the path if your CSS file is located elsewhere
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EnterCode(){
    const [code, setCode] = useState('');
    const navigate = useNavigate(); // Use the useNavigate hook
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if(1==1){
                alert('Code Entered Successfully');
                navigate('/ChangePassword');
            }
        } catch (error) {
            
        }
    //todo later

    }
    return(
        <div>
            <div className='page-background'></div>
            <div className='enter-code'>
                <h2>Enter the Code We Emailed You</h2>
                <form id="codeCheck" onSubmit={handleSubmit}>
                    <div id="textInput">
                        <input 
                            type="number" 
                            id="emailCode" 
                            placeholder="Code" 
                            required
                            value={code} 
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}
export default EnterCode;