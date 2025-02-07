import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function UserProfile({ userData }) {
    const [profileData, setProfileData] = useState(null);
    const [likedPosts, setLikedPosts] = useState([]);
    const [showLikedPosts, setShowLikedPosts] = useState(false);
    const [usersPosts, setUsersPosts] = useState([]);
    const [showUsersPosts, setShowUsersPosts] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData || userData.length === 0 || !userData[0].Email) {
            console.log('No Email provided or userData is empty');
            return;
        }

        const email = userData[0].Email;
        const fetchProfileDetails = async () => {
            try {
                const userProfileResponse = await axios.get(`http://localhost:8800/userprofile`, { params: { email } });
                const likedPostsResponse = await axios.get(`http://localhost:8800/UserProfile/${email}/liked-posts`);
                const usersPostsResponse = await axios.get(`http://localhost:8800/usersposts`, { params: { email } });

                if (userProfileResponse.status === 200) {
                    setProfileData(userProfileResponse.data);
                }
                if (likedPostsResponse.status === 200) {
                    setLikedPosts(likedPostsResponse.data || []);
                }
                if (usersPostsResponse.status === 200) {
                    setUsersPosts(usersPostsResponse.data || []);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchProfileDetails();
    }, [userData]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this post? It will be permanently deleted and cannot in any way be recovered.");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8800/posts/${id}`);
                window.location.reload();
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleRemoveFromLiked = async (postId) => {
        try {
            const response = await axios.post(`http://localhost:8800/posts/${postId}/unlike`, { email: userData[0].Email });
            if (response.status === 200) {
                
                setLikedPosts(likedPosts.filter(post => post.id !== postId));
            } else {
                throw new Error('Failed to remove from liked posts.');
            }
        } catch (error) {
            console.error('Error removing from liked posts:', error);
        }
    };

    if (!profileData) {
        return <div>Loading user data...</div>;
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '120px', alignContent: 'center', minHeight: '100vh' }}>
            <h1>Welcome, {profileData.displayName || 'No Display Name'}!</h1>
            {profileData.profilePicture && (
                <img
                    src={`http://localhost:8800/uploads/${profileData.profilePicture}`}
                    alt="User profile"
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        display: 'block',
                        margin: '20px auto',
                    }}
                />
            )}

            {userData[0].isAdmin.data[0] === 1 && (
                <p>You are an admin</p>
            )}

            {userData[0].allergies && (
                <p><strong>Allergies: </strong>{userData[0].allergies}</p>
            )}

            {userData[0].favoriteFood && (
                <p><strong>Favorite Food: </strong>{userData[0].favoriteFood}</p>
            )}

            <div style={{ display: 'inline-block', position: 'relative', marginRight: '200px' }}>
                <button onClick={() => setShowLikedPosts(!showLikedPosts)} style={{ cursor: 'pointer' }}>
                    Show Liked Posts
                </button>
                {showLikedPosts && (
                    <div style={{ position: 'absolute', backgroundColor: '#fff', padding: '10px', border: '1px solid black', top: '100%', left: 0, zIndex: 100 }}>
                        {likedPosts.length > 0 ? (
                            likedPosts.map((post) => (
                                <div key={post.id} style={{ margin: '10px', border: '1px solid #ccc' }}>
                                    <h3 onClick={() => navigate(`/posts/${post.id}`)} style={{ cursor: 'pointer' }}>{post.title}</h3>
                                    {post.img && (
                                        <img
                                            src={`http://localhost:8800/uploads/${post.img}`}
                                            alt={post.title}
                                            style={{ maxWidth: '300px', height: 'auto', display: 'block', margin: 'auto' }}
                                        />
                                    )}
                                    <p>
                                        <strong>Recipe:</strong> {post.recipe}
                                    </p>
                                    <p>
                                        <strong>Instructions:</strong> {post.instructions}
                                    </p>
                                    <p>
                                        <strong>Nutrition:</strong> {post.nutrition}
                                    </p>
                                    <p>
                                        <strong>Likes:</strong> {post.likes}
                                    </p>
                                    <button onClick={() => handleRemoveFromLiked(post.id)} style={{ marginBottom: '10px', color: 'red', border: '1px solid black' }}>Remove from Liked</button>
                                </div>
                            ))
                        ) : (
                            <p>No liked posts yet.</p>
                        )}
                    </div>
                )}
            </div>

            <div style={{ display: 'inline-block', position: 'relative' }}>
                <button onClick={() => setShowUsersPosts(!showUsersPosts)} style={{ cursor: 'pointer' }}>
                    Show Your Posts
                </button>
                {showUsersPosts && (
                    <div style={{ position: 'absolute', backgroundColor: '#fff', padding: '10px', border: '1px solid black', top: '100%', left: 0, zIndex: 100 }}>
                        {usersPosts.length > 0 ? (
                            usersPosts.map((post) => (
                                <div key={post.id} style={{ margin: '10px', border: '1px solid #ccc' }}>
                                    <h3 onClick={() => navigate(`/posts/${post.id}`)} style={{ cursor: 'pointer' }}>{post.title}</h3>
                                    {post.img && (
                                        <img
                                            src={`http://localhost:8800/uploads/${post.img}`}
                                            alt={post.title}
                                            style={{ maxWidth: '300px', height: 'auto', display: 'block', margin: 'auto' }}
                                        />
                                    )}
                                    <p>
                                        <strong>Recipe:</strong> {post.recipe}
                                    </p>
                                    <p>
                                        <strong>Instructions:</strong> {post.instructions}
                                    </p>
                                    <p>
                                        <strong>Nutrition:</strong> {post.nutrition}
                                    </p>
                                    <p>
                                        <strong>Likes:</strong> {post.likes}
                                    </p>

                                    <button style={{ marginBottom: "10px", border: '1px solid black' }} onClick={() => navigate(`/updatepost/${post.id}`)}>Update</button>
                                    <button style={{ marginBottom: "10px", color: 'red', border: '1px solid black' }} onClick={() => handleDelete(post.id)}>Delete</button>
                                </div>
                            ))
                        ) : (
                            <p>No posts yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfile;
