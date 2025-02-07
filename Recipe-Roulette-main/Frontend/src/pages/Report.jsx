import React, { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

/**
 * documentation here oops
 */
const Report = ({ userData }) => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [reportData, setReportData] = useState({
        reportArea: "",
        reportDesc: ""
    });

    const handleChange = (e) => {
        setReportData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if(reportData.reportArea === "" || reportData.reportDesc === ""){
            alert("All fields must be filled out");
        } else {
            const requestData = {
                user_email: userData[0].Email,
                report_area: reportData.reportArea,
                report_details: reportData.reportDesc,
                postID: postId
            };
    
            try {
                const response = await axios.post("http://localhost:8800/reports", requestData);
                console.log(response.data); // Assuming the backend sends back some data
                navigate("/posts/" + postId);
            } catch (err) {
                console.error(err);
            }
        }
    };
    
    

    return(
        <div>
            <p>
                <label htmlFor="reportArea">Area of Concern:</label>
                <input type="text" name="reportArea" id="reportArea" onChange={handleChange} />
            </p>

            <p>
                <label htmlFor="reportDesc">Enter Post Description:</label>
                <textarea name="reportDesc" id="reportDesc" rows="4" cols="100" onChange={handleChange}></textarea>
            </p>

            <p>
                <button className="submitReport" onClick={handleSubmit}>Submit Report</button>
            </p>
        </div>
    )
}

export default Report;
