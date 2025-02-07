import React, { useState } from 'react';
import axios from 'axios'; // Axios is used for making HTTP requests from the browser.

/**
 * Component for creating a new user account.
 * Allows users to input their details, select a profile picture, and submit the form.
 */
function CreateAccount() {
  // State hooks to store the values of the form fields.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setName] = useState('');
  const [favoriteFood, setFood] = useState('');
  const [allergies, setAllergies] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  /**
   * Handles the change event of the file input for profile picture.
   * Sets the profilePicture state to the selected file.
   * @param {Event} e - The event triggered by changing the file input.
   */
  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  /**
   * Handles the form submission event.
   * Validates the form data, creates FormData object for submission, and posts it to the server.
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validates the email address format.
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Validates the password complexity.
    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      alert('Password does not meet the requirements.');
      return;
    }

    // Prepares the FormData object for HTTP POST request.
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('displayName', displayName);
    formData.append('favoriteFood', favoriteFood);
    formData.append('allergies', allergies);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      // Sends the form data to the server.
      const response = await axios.post('http://localhost:8800/CreateAccount', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Alerts the user based on the response status.
      if (response.status === 201) {
        alert('Account created successfully! You can now log in.');
      } else {
        alert('Failed to create an account. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit the form', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="createAccountContainer">
      <div className="createAccount">
        <h1>Welcome to Recipe Roulette</h1>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" id="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" id="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <div>Password must have at least 8 characters, include both uppercase and lowercase letters, a number, and a special character.</div>
          <input type="text" id="displayName" placeholder="Display Name" value={displayName} onChange={(e) => setName(e.target.value)} />
          <input type="text" id="favoriteFood" placeholder="Favorite Food" value={favoriteFood} onChange={(e) => setFood(e.target.value)} />
          <input type="text" id="allergies" placeholder="Allergies (comma separated)" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
          <input type="file" id="fileUpload" hidden onChange={handleFileChange} />
          <label htmlFor="fileUpload" className="custom-file-upload">Upload Profile Picture</label>
          <button type="submit">Create Account</button>
        </form>
        <p>Already have an account?</p>
        <a href="/">Log In</a>
      </div>
    </div>
  );
}

export default CreateAccount;
