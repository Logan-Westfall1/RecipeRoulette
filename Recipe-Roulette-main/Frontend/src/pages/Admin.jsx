import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Admin component displays the admin page if the user is an admin.
 * 
 * @param {Object} props - The props object containing user data.
 * @param {Array} props.userData - An array containing user data.
 * @returns {JSX.Element} - The JSX element representing the admin page.
 */
const Admin = ({ userData }) => {
    //Creates reports UseState to store all report data
    //Creates an object to handle navigation
    const [reports, setReports] = useState([]);
    const navigate = useNavigate();

    //Double checking that only admins are viewing this page
    if (userData[0].isAdmin.data[0] === 0) {
        navigate(-1);
    }

    /**
     * When he page loads, all of the reports from the database are fetched
     * and stored in the reports UseState
     */
    useEffect(() => {
        const fetchAllReports = async () => {
            try {
                const res = await axios.get("http://localhost:8800/reports");
                if (res.status === 200) {
                    console.log('Report data:', res.data);
                }
                setReports(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllReports();
    }, []);


    /**
     * This function deletes the specified report from the database and viewport
     * 
     * @param reportID the ID for the report that will be deleted
     */
    const resolveReport = async (reportID) => {
        console.log("attempting to delete report with ID:", reportID);
        try {
            const res = await axios.delete(`http://localhost:8800/reports/${reportID}`);
            console.log(res.data); // Log success message
            // Remove the resolved report from the local UseState
            setReports(reports.filter(report => report.reportID !== reportID));
        } catch (err) {
            console.log(err);
        }
    };

    //JSX to render this component
    return (
        <div className="allEncompassingDiv">
            <h1>All Reports</h1>
            <div className="reports">

                {/*Maps all of the reports to display each one individually*/}
                {reports.map(report => (
                    <div className="report" key={report.reportID}>

                        {/*The area of concern for the report*/}
                        <h3 style={{ cursor: 'pointer' }}>{report.reportArea}</h3>

                        {/*The report description*/}
                        <p>{report.reportContent}</p>

                        {/*Report Creator*/}
                        <p><strong>By: </strong>{report.reporter}</p>

                        {/*Button view the post that was reported*/}
                        <button className="viewReportedPostButton" onClick={() => navigate(`/posts/${report.postID}`)}>View Reported Post</button>
                        
                        {/*Button to resolve the report and delete it*/}
                        <button className="resolveReportButton" onClick={() => resolveReport(report.reportID)}>Resolve Report</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;
