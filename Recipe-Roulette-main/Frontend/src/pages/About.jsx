import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * The About component represents the about page for the Recipe Roulette application.
 * It provides users with the ability to rate their experience and submit feedback.
 * 
 * @param {Object} userData - The user data object containing email, required for submitting ratings.
 */
const About = ({ userData }) => {
    // State to manage the user's rating (initially 0).
    const [rating, setRating] = useState(0);

    // State to manage the loading status during API calls.
    const [isLoading, setIsLoading] = useState(false);

    // Hook to programatically navigate the user to different routes.
    const navigate = useNavigate();

    /**
     * Handles changes to the rating select input by updating the rating state.
     * @param {Event} event - The change event from the rating input.
     */
    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    /**
     * Submits the user's rating to the backend.
     * Checks for valid user data and email before sending.
     * Updates loading state and alerts the user based on the outcome.
     */
    const submitRating = async () => {
        // Validation to ensure that user data and email are present.
        if (!userData || userData.length === 0 || !userData[0].Email) {
            console.error('No Email provided or userData is empty');
            alert('Your email is required to submit a rating.');
            return;
        }

        // Enable loading state before starting the API request.
        setIsLoading(true);
        try {
            // API call to submit the rating. 
            const response = await axios.post('http://localhost:8800/submit-rating', {
                email: userData[0].Email,
                rating
            });

            // Check if the response is successful and alert the user.
            if (response.status === 200) {
                alert('Thank you for your feedback!');
            }
        } catch (error) {
            // Log and alert on any API call errors.
            console.error('Error submitting rating:', error);
            alert('Error submitting rating. Please try again later.');
        } finally {
            // Ensure loading state is disabled after API response.
            setIsLoading(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: 'auto', paddingTop: '100px' }}>
            <h1 style={{ textAlign: 'center' }}>About Recipe Roulette</h1>
            <div style={{ border: '2px solid', padding: '20px', borderRadius: '10px' }}>
                <h2>Why Recipe Roulette?</h2>
                <p>Recipe Roulette isn't just another recipe app. It's a dynamic platform designed to transform how you think about, prepare, and enjoy food. Whether you're in a cooking rut, feeling adventurous, or just looking for a way to spice up your daily meals, Recipe Roulette offers a unique solution that injects fun, creativity, and community into your culinary ventures. By turning the meal decision-making process into a thrilling game, Recipe Roulette makes each cooking experience unpredictable and exciting, fostering a vibrant community of food lovers who embrace new flavors and experiences.</p>
                <h2>How It Works</h2>
                <p>Our app features a "Recipe of the Day" which is randomly selected from recipes posted by users like you. Engage with the community by posting your own recipes, searching for dishes based on ingredients you have on hand, and saving your favorite recipes for easy access later. Every recipe is a personal journey, and we’re here to make that journey enjoyable and fulfilling for everyone involved.</p>
                <h2>Share Your Experience</h2>
                <p>We value your feedback! How would you rate your experience with Recipe Roulette?</p>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <select value={rating} onChange={handleRatingChange} style={{ width: '100%', maxWidth: '300px' }}>
                        <option value="0">Select a rating</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                    </select>
                </div>
                <button onClick={submitRating} disabled={isLoading} style={{ width: '100%', maxWidth: '300px', padding: '10px 0' }}>
                    {isLoading ? 'Submitting...' : 'Submit Rating'}
                </button>
            </div>
        </div>
    );
};

export default About;
