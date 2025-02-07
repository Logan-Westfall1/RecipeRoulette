import React, { Component } from 'react';
import axios from 'axios';

class ProfileManagement extends Component {
    /*
    contructor for file 
    initilzing objects such as email, username, favorite food, allergies, and profile picture
    */
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            displayName: '',
            favoriteFood: '',
            allergies: '' ,
            profilePicture: null,
            profilePicPreview: null,
        };
    }
    //handles change in profile name
    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    /**
    *Handles a submission of new Profile image
    checks if the submitted file is of image format
    */
    handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/jpg")) {
            this.setState({
                profilePicture: file,
                profilePicPreview: URL.createObjectURL(file),
            });
        } else {
            alert("Only JPEG images are allowed.");
        }
    };

    //handles form submission
    handleSubmit = async (event) => {
        //this block prevents default values, then sets state varibles, creates a new formData object and appends the given information to it
        event.preventDefault();
        const { email, displayName, favoriteFood, allergies, profilePicture } = this.state;
        const formData = new FormData();
        formData.append('email', email);
        formData.append('displayName', displayName);
        formData.append('favoriteFood', favoriteFood);
        formData.append('allergies', allergies);

        //if profile picture exists append profile picture to data object
        if (profilePicture) formData.append('profilePicture', profilePicture);

        try {
             //trys to post the server to update the profile and sends an alert if successful
            await axios.post('http://localhost:8800/profilemanagement', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Profile updated successfully!');
        } catch (error) {
            //catchs when the post fails and sends an alert to the user
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    render() {
        const { email, displayName, favoriteFood, allergies, profilePicPreview } = this.state;

        // Styles for input fields
        const inputStyle = {
            padding: '10px',
            marginBottom: '10px', 
            width: 'calc(100% - 22px)', 
            borderRadius: '5px',
            border: '1px solid #ccc',
            textAlign: 'left',
        };

        // Renders the form for updating profile including email, display name, favorite food, allergies, and profile photo
        return (
            <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
                <h2>Update Profile</h2>
                <form onSubmit={this.handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input
                        style={inputStyle}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={this.handleInputChange}
                        required
                    />
                    <div style={{ fontSize: '12px', marginBottom: '10px', color: 'red', textAlign: 'center' }}>Email is required</div>
                    <input
                        style={inputStyle}
                        type="text"
                        name="displayName"
                        placeholder="Display Name"
                        value={displayName}
                        onChange={this.handleInputChange}
                    />
                    <input
                        style={inputStyle}
                        type="text"
                        name="favoriteFood"
                        placeholder="Favorite Food"
                        value={favoriteFood}
                        onChange={this.handleInputChange}
                    />
                    <input
                        style={inputStyle}
                        type="text"
                        name="allergies"
                        placeholder="Allergies"
                        value={allergies}
                        onChange={this.handleInputChange}
                    />
                    <input
                        style={{ ...inputStyle, padding: '0' }} 
                        type="file"
                        accept=".jpeg, .jpg"
                        onChange={this.handleFileChange}
                    />
                    {profilePicPreview && (
                        <img src={profilePicPreview} alt="Profile Preview" style={{ width: "100px", height: "100px", borderRadius: "50%", margin: '10px 0' }} />
                    )}
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Update Profile
                    </button>
                </form>
            </div>
        );
    }
}

export default ProfileManagement;
