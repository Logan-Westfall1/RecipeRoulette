import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Note: No need to import Link now
import '../App.css';

function Home({ userData }) {
    let navigate = useNavigate();

    // State to store the recipe of the day
    const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);

    useEffect(() => {
        // Fetch the recipe of the day from your backend column
        const fetchRecipeOfTheDay = async () => {
            try {
                const response = await axios.get('http://localhost:8800/recipeOfTheDay'); // Adjust this URL as necessary
                setRecipeOfTheDay(response.data);
            } catch (error) {
                console.error('Error fetching the recipe of the day:', error);
            }
        };

        fetchRecipeOfTheDay();
    }, []); 

    // Function to navigate to the CreatePost page
    const createPostButton = () => {
        navigate('/CreatePost');
    };

    // Function to navigate to the posts page
    const navigateToPosts = () => {
        navigate('/posts');
    };

    // Returns HTML to be displayed
    return (
        <div className="homeBackground">
            <div className="home" style={{ textAlign: 'center' }}>
                <h1 style={{ paddingTop:'80px', fontSize: '2.5rem', marginBottom: '5px' }}>Welcome to Recipe Roulette</h1>
                <p style={{ marginBottom: '20px' }}>Your one-stop destination for discovering new recipes!</p>

                {/* Display the recipe of the day */}
                {recipeOfTheDay && (
                    <div onClick={navigateToPosts} style={{ cursor: 'pointer', marginBottom: '40px' }}>
                        <h2>Recipe of the Day: {recipeOfTheDay.title}</h2>
                        <p>{recipeOfTheDay.desc}</p>
                        {/* Click photo to navigate to Posts page */}
                        <img src={`http://localhost:8800/uploads/${recipeOfTheDay.img}`} alt="Recipe of the Day" style={{ maxWidth: '500px', height: 'auto', borderRadius: '10px' }} />
                    </div>
                )}
                
                { /* Click button to navigate to CreatePost page */ }
                <button onClick={createPostButton} style={{ fontSize: '1rem', padding: '10px 20px', backgroundColor: '#1ac04c', color: 'white', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' }}>
                    CREATE NEW POST
                </button>
            </div>
        </div>
    );
}

export default Home;
