import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = ({ userData }) => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [likedByUser, setLikedByUser] = useState(false);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const postResponse = await axios.get(`http://localhost:8800/posts/${postId}`);
                if (postResponse.status === 200) {
                    setPost(postResponse.data);
                    setLikes(postResponse.data.likes || 0);
                    setComments(postResponse.data.comments || []);
                }
                const likeStatusResponse = await axios.get(`http://localhost:8800/UserProfile/${userData[0].Email}/liked-posts`);
                const likedPosts = likeStatusResponse.data || [];
                setLikedByUser(likedPosts.includes(parseInt(postId)));
            } catch (error) {
                console.error('Failed to fetch post details:', error);
            }
        };

        fetchPostDetail();
    }, [postId, userData]);

    const handleLike = async () => {
        if (!userData || userData.length === 0 || !userData[0].Email) {
            alert('Your email is required to like a post.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8800/posts/${postId}/like`, { email: userData[0].Email });
            if (response.status === 200) {
                setLikes(prevLikes => prevLikes + 1);
                setLikedByUser(true);
            } else {
                throw new Error('Failed to like the post.');
            }
        } catch (error) {
            alert('Post already liked.');
        }
    };
    
    const handleSubmitComment = async () => {
        if (comment.trim().length === 0) {
            setError('Comment cannot be empty');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8800/posts/${postId}/comments`, {
                email: userData[0].Email,
                comment,
                displayName: userData[0].displayName 
            });
            if (response.status === 200) {
                setComments(prevComments => [...prevComments, response.data.comment]);
                setComment(''); // Clear the comment input
                setError(''); // Clear any error message
            } else {
                setError(response.data); // Display backend provided error message
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data); // Set error from backend response
            } else {
                setError('Failed to post comment. Please try again.');
            }
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this post using administrator power? It will be permanently deleted and cannot in any way be recovered.");
        if (confirmed) {
            try {
                await axios.delete(`http://localhost:8800/posts/${postId}`);
                navigate(-1); // Navigate back after deletion
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete the post. Please try again.');
            }
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: 'center', paddingTop: '250px' }}>
            <button onClick={goBack} style={{ cursor: 'pointer', position: 'fixed', top: 80, left: 20, zIndex: 1000 }}>&#x2190; Back</button>
            <h1>{post.title}</h1>
            {post.img && (
                <img src={`http://localhost:8800/uploads/${post.img}`} alt={post.title} style={{ maxWidth: '300px', height: 'auto', display: 'block', margin: '0 auto' }} />
            )}
            <p>{post.desc}</p>
            <p><strong>Recipe:</strong> {post.recipe}</p>
            <p><strong>Instructions:</strong> {post.instructions}</p>
            <p><strong>Nutrition:</strong> {post.nutrition}</p>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={handleLike} disabled={likedByUser} style={{ margin: '10px' }}>
                Like ({likes})
            </button>
            {userData && userData[0] && userData[0].isAdmin && userData[0].isAdmin.data[0] === 1 && (
                <button onClick={handleDelete} style={{ margin: '10px', color: 'red', border: '1px solid black' }}>
                    Delete as an Admin
                </button>
            )}
            <button onClick={() => navigate(`/report/${post.id}`)}>Report</button>
            <div className='commentsSection' style={{ marginTop: '20px', alignContent: 'center', width: '60vw', margin: '0 auto' }}>
                <h3>Comments</h3>
                <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px', marginBottom: "20px" }}>
                    {comments.map((c, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <p><strong>{c.displayName}:</strong> {c.comment}</p>
                        </div>
                    ))}
                </div>
                <div style={{ alignItems: 'center', marginBottom: '10px' }}>
                    <input
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        style={{ marginRight: '10px', width: '300px' }}
                    />
                    <button onClick={handleSubmitComment} style={{ marginBottom: '20px' }}>Post Comment</button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
