import React, { useState } from "react";
import "../App.css" // Update the path if your CSS file is located elsewhere
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = ({userData}) => {
    const [post, setPost] = useState({
        postTitleInput: "",
        postDescriptionInput: "",
        postRecipeIngredientInput: "",
        postRecipeInstructionsInput: "",
        postNutritionInfoInput: "",
    });

    const [postImg, setPostImg] = useState();

    const navigate = useNavigate();

    const handleImgChange = (e) => {
        setPostImg(e.target.files[0]);
    };
    

    const handleChange = (e) => {
        setPost(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formdata = new FormData();
        formdata.append('title', post.postTitleInput);
        formdata.append('desc', post.postDescriptionInput);
        formdata.append('img', postImg);
        formdata.append('recipe', post.postRecipeIngredientInput);
        formdata.append('instructions', post.postRecipeInstructionsInput);
        formdata.append('nutrition', post.postNutritionInfoInput);
        formdata.append('creator', userData[0].Email);


        try{
            await axios.post("http://localhost:8800/posts", formdata);
            navigate("/posts")
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="allEncompassingDiv">
            <div name="createPostForm" className="createPostForm">
                <h1 name="createPostTitle" id="createPostTitle" className="createPostTitle">Create a Post</h1>


                <p>
                    <label htmlFor="postTitleInput">Enter Post Title:</label>
                    <input type="text" name="postTitleInput" id="postTitleInput" onChange={handleChange} />
                </p>

                <p>
                    <label htmlFor="postDescriptionInput">Enter Post Description:</label>
                    <textarea name="postDescriptionInput" id="postDescriptionInput" rows="4" cols="100" onChange={handleChange}></textarea>
                </p>

                <p>
                    <label htmlFor="postImageInput">Upload Post Image:</label>
                    <input type="file" name="postImageInput" id="postImageInput" accept=".jpeg, .jpg, .png" onChange={handleImgChange} />
                </p>

                <p>
                    <label htmlFor="postRecipeIngredientInput">Enter Recipe:</label>
                    <textarea name="postRecipeIngredientInput" id="postRecipeIngredientInput" placeholder="Enter each ingredient separated by comma and a space (ex: Ingredient 1, Ingredient 2, Ingredient 3)" rows="4" cols="100" onChange={handleChange}></textarea>
                </p>

                <p>
                    <label htmlFor="postRecipeInstructionsInput">Enter Recipe Instructions:</label>
                    <textarea name="postRecipeInstructionsInput" id="postRecipeInstructionsInput" rows="4" cols="100" onChange={handleChange}></textarea>
                </p>

                <p>
                    <label htmlFor="postNutritionInfoInput">Enter Nutrition Information:</label>
                    <textarea name="postNutritionInfoInput" id="postNutritionInfoInput" rows="4" cols="100" onChange={handleChange}></textarea>
                </p>

                <p>
                    <button className="submitPostButton" onClick={handleSubmit}>Submit Post</button>
                </p>

            </div>

        </div>
    );
};

export default CreatePost;
