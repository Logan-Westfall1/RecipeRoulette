import React, { useState, useEffect } from "react"; // Import React and necessary hooks
import axios from "axios"; // Import Axios for HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from React Router for navigation
import "../App.css"; // Import CSS file for styling

// Component named Posts
const Posts = () => {
    // State variables for storing posts data and for navigation
    const [posts, setPosts] = useState([]); // State variable to hold posts data
    const navigate = useNavigate(); // Hook for navigation

    // useEffect hook to fetch posts data when the component mounts
    useEffect(() => {
        // Function to fetch all posts data asynchronously
        const fetchAllPosts = async () => {
            try {
                // Send a GET request to fetch posts data from the server
                const res = await axios.get("http://localhost:8800/posts");
                // If the request is successful (status code 200), log the data to the console
                if (res.status === 200) {
                    console.log('Post data:', res.data);
                }
                // Set the posts state variable with the fetched data
                setPosts(res.data);
            } catch (err) {
                // If an error occurs during the request, log the error to the console
                console.log(err);
            }
        };
        // Call the fetchAllPosts function when the component mounts
        fetchAllPosts();
    }, []); // The useEffect hook runs only once when the component mounts, indicated by the empty dependency array

    // JSX to render the component
    return (
        <div className="allEncompassingDiv"> {/* Outer div to encapsulate all content */}
            <h1>All Posts</h1> {/* Heading to display on the page */}
            <div className="posts"> {/* Div to contain all individual posts */}
                {/* Map through the posts array and render each post */}
                {posts.map(post => (
                    <div className="post" key={post.id}> {/* Div to represent each post */}
                        {/* Clickable title of the post that navigates to the post's details page */}
                        <h2 onClick={() => navigate(`/posts/${post.id}`)} style={{ cursor: 'pointer' }}>{post.title}</h2>
                        {/* Render post image if available */}
                        {post.img && <img src={`http://localhost:8800/uploads/${post.img}`} alt='img for post' className="postImage" />}
                        {/* Display post description */}
                        <p>{post.desc}</p>
                        {/* Display post recipe */}
                        <p><strong>Recipe: </strong>{post.recipe}</p>
                        {/* Display post instructions */}
                        <p><strong>Instructions: </strong>{post.instructions}</p>
                        {/* Display post nutrition information */}
                        <p><strong>Nutrition: </strong>{post.nutrition}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Export the Posts component as the default export of this module
export default Posts;