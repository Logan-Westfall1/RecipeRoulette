import React, { useState, useEffect } from "react";
import "../App.css"; // Update the path if your CSS file is located elsewhere
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePost = ({userData}) => {
    const { postId } = useParams();
    const [postData, setPostData] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/posts/${postId}`);
                if (response.status === 200) {
                    setPostData(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch post details:', error);
            }
        };
        fetchPostDetail();
    }, [postId]);

    useEffect(() => {
        if((postData !== "") && (postData.creator !== userData[0].Email)){
            alert("This page is not authorized");
            navigate(-1);
        }
    }, [postData, userData]);


    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            await axios.put("http://localhost:8800/posts/" + postId, postData)
            navigate("/userProfile")
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="allEncompassingDiv" style={{ alignItems: 'center', justifyContent: 'center' }}>
            <div name="updatePostForm" className="updatePostForm">
                <h1 name="updatePostTitle" id="updatePostTitle" className="updatePostTitle">Edit Your Post</h1>
                
                <p>
                    <label htmlFor="title">Enter Post Title:</label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={postData.title}
                        onChange={handleChange}
                    />
                </p>

                <p>
                    <label htmlFor="desc">Enter Post Description:</label>
                    <textarea
                        name="desc"
                        id="desc"
                        rows="4"
                        cols="100"
                        style={{ margin: '10px auto', textAlign: 'center' }} // Center text horizontally and vertically
                        value={postData.desc}
                        onChange={handleChange}
                    />
                </p>

                <p>
                    <label htmlFor="recipe">Enter Recipe:</label>
                    <textarea
                        name="recipe"
                        id="recipe"
                        placeholder="Enter each ingredient separated by comma and a space (ex: Ingredient 1, Ingredient 2, Ingredient 3)"
                        rows="4"
                        cols="100"
                        style={{ margin: '10px auto', textAlign: 'center' }} // Center text horizontally and vertically
                        value={postData.recipe}
                        onChange={handleChange}
                    />
                </p>

                <p>
                    <label htmlFor="instructions">Enter Recipe Instructions:</label>
                    <textarea
                        name="instructions"
                        id="instructions"
                        rows="4"
                        cols="100"
                        style={{ margin: '10px auto', textAlign: 'center' }} // Center text horizontally and vertically
                        value={postData.instructions}
                        onChange={handleChange}
                    />
                </p>

                <p>
                    <label htmlFor="nutrition">Enter Nutrition Information:</label>
                    <textarea
                        name="nutrition"
                        id="nutrition"
                        rows="4"
                        cols="100"
                        style={{ margin: '10px auto', textAlign: 'center' }} // Center text horizontally and vertically
                        value={postData.nutrition}
                        onChange={handleChange}
                    />
                </p>

                <p>
                    <button className="submitPostButton" onClick={handleSubmit}>Update Post</button>
                </p>
            </div>
        </div>
    );
};

export default UpdatePost;
