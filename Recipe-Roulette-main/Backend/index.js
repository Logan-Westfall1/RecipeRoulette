import express from "express";
import mysql from "mysql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from 'cors';
import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




//secret key 
const SECRET_KEY = "eYy2S6y5gU3uY0dG4iW5rP8tB6nA9pD1";

const db = mysql.createConnection({
    host:"reciperoulette.cbeqcwggayn1.us-east-1.rds.amazonaws.com",
    user: "group7admin",
    password: "groupseven8264",
    database: "recipeRouletteDb"
})

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //const uploadPath = path.join(__dirname, 'uploads/');
      const uploadPath = 'uploads';
      console.log('Attempting to save to:', uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
});
  const upload = multer({ storage: storage });


app.get("/", (req, res) => {
    res.json("hello, this is the backend");
})

app.get("/posts", (req, res) => {
    const q ="SELECT * FROM recipeRouletteDb.Posts";
    db.query(q, (err, data) => {
        if(err) return  res.json(err);
        return res.json(data);
    })
})

app.get("/usersposts", (req, res) => {
    const { email } = req.query;
    const q = "SELECT * FROM recipeRouletteDb.Posts WHERE creator = ?";
    db.query(q, email, (err, data) => {
        if(err) return  res.json(err);
        return res.json(data);
    })
})


// Method to get data for logged-in user
app.get("/userData", (req, res) => {
    const userEmail = req.query.email; // Get the email from query parameters
    const q = "SELECT * FROM recipeRouletteDb.Users WHERE Email = ?";
    db.query(q, [userEmail], (err, data) => {
        if(err) return  res.json(err);
        if (data.length === 0) {
            return res.status(404).json({ error: "there aint stuff here" });
        }
        return res.json(data);
    });
});


app.post("/CreateAccount", upload.single('profilePicture'), async (req, res) => {
    const { email, password, displayName, favoriteFood, allergies } = req.body;
    let profilePicture = req.file ? req.file.filename : null; // Using the filename only

    console.log(req.body); // Debugging to see what is received
    console.log("Received file: ", profilePicture);

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password

        const query = `INSERT INTO Users (email, password, displayName, favoriteFood, allergies, profilePicture) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(query, [email, hashedPassword, displayName, favoriteFood, allergies, profilePicture], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: "Failed to create an account. Possibly duplicate email." });
            }
            res.status(201).json({ message: "Account created successfully! You can now log in." });
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = "SELECT email, password FROM Users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = results[0];
        const hashedPassword = user.password;

        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }
            // If credentials are valid, generate JWT token
            const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '24h' });
            res.json({ message: "Login successful", token });
        } catch (error) {
            console.error('Error during password comparison:', error);
            res.status(500).json({ message: "Error during password comparison" });
        }
    });
});

app.post("/posts", upload.single('img'), (req, res) => {
    const { title, desc, recipe, instructions, nutrition, creator } = req.body;
    const img = req.file ? req.file.filename : null; // Handling cases where an image might not be uploaded

    // Insert the new post
    const insertQuery = "INSERT INTO Posts (`title`, `desc`, `img`, `recipe`, `instructions`, `nutrition`, `createdAt`, `isRecipeOfTheDay`, `creator`) VALUES (?, ?, ?, ?, ?, ?, NOW(), FALSE, ?)";
    db.query(insertQuery, [title, desc, img, recipe, instructions, nutrition, creator], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error creating post" });
        }

        // Check if this post should be the Recipe of the Day: first post of the day
        const date = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
        const checkQuery = "SELECT id FROM Posts WHERE DATE(createdAt) = ? AND isRecipeOfTheDay = TRUE";
        db.query(checkQuery, [date], (checkErr, checkResult) => {
            if (checkErr) {
                console.error(checkErr);
                // Proceed without setting the recipe of the day in case of error
                return res.json({ message: "Post created successfully" });
            }

            if (checkResult.length === 0) { // No recipe of the day set yet for today
                const updateQuery = "UPDATE Posts SET isRecipeOfTheDay = TRUE WHERE id = ?";
                db.query(updateQuery, [result.insertId], (updateErr) => {
                    if (updateErr) {
                        console.error(updateErr);
                        // Proceed without setting the recipe of the day in case of error
                    }
                    return res.json({ message: "Post created successfully and set as Recipe of the Day" });
                });
            } else {
                return res.json({ message: "Post created successfully" });
            }
        });
    });
});

app.put("/posts/:postId", upload.single('img'), (req, res) => {
    const postId = req.params.postId
    const q = "UPDATE Posts SET `title` = ?, `desc` = ?, `recipe` = ?, `instructions`= ?, `nutrition` = ? WHERE id = ?"
    
    const values = [req.body.title, req.body.desc, req.body.recipe, req.body.instructions, req.body.nutrition]
    
    db.query(q, [...values, postId], (err, data) => {
        if(err)     return res.json(err)
        return res.json("Post has been updated successfully")
    })

});

app.delete("/posts/:id", (req, res) => {
    const postId = req.params.id
    const q = "DELETE FROM Posts WHERE id = ?"

    db.query(q, [postId], (err, data) => {
        if(err)     return res.json(err)
        return res.json("Post has been deleted successfully")
    })
})


// Profile update endpoint using POST
app.post("/profilemanagement", upload.single('profilePicture'), (req, res) => {
    const { email, displayName, favoriteFood, allergies } = req.body;
    let profilePicture = req.file.filename;
    
    // Ensure the email is provided for the update operation
    if (!email) {
        return res.status(400).json({ message: "Email is required to update profile." });
    }

    const query = `UPDATE Users SET displayName = ?, favoriteFood = ?, allergies = ?, profilePicture = ? WHERE email = ?`;
  
    db.query(query, [displayName, favoriteFood, allergies, profilePicture, email], (err, results) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ message: "Failed to update profile" });
      }
      if (results.affectedRows === 0) {
        
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json({ message: "Profile updated successfully" });
    });
});

app.get("/recipeOfTheDay", (req, res) => {
   //This function selects first post on new day for recipe of the day with a time stamp
    const query = "SELECT * FROM Posts WHERE isRecipeOfTheDay = TRUE AND DATE(createdAt) = CURDATE() LIMIT 1";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
          
            return res.status(500).json({ message: "Internal Server Error - failed to query the database." });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No Recipe of the Day found." });
        }
       
        res.json(results[0]);
    });
});

app.get('/search', async (req, res) => {
    const { ingredients, allergies } = req.query;

    //Validate inputs 
    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ message: 'Ingredients are required' });
    }
    //Split inputs as they are stored in the database
    const ingredientsList = ingredients.split(',').map(ing => `%${ing.trim().toLowerCase()}%`);
    const allergiesList = allergies ? allergies.split(',').map(allergy => `%${allergy.trim().toLowerCase()}%`) : [];

    let query = 'SELECT * FROM Posts WHERE ';
    const queryParams = [];

    // Include ingredients search conditions
    query += ingredientsList.map(() => `LOWER(recipe) LIKE ?`).join(' OR ');
    queryParams.push(...ingredientsList);
    // Exclude recipes containing any allergies at all 
    if (allergiesList.length > 0) {
        // Ensure there's an AND condition if there are ingredient conditions
        if (ingredientsList.length > 0) {
            query += ' AND ';
        }
        // Each allergy adds a NOT LIKE condition to the query
        query += allergiesList.map(() => `LOWER(recipe) NOT LIKE ?`).join(' AND ');
        queryParams.push(...allergiesList);
    }

    // Search the database 
    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Search query error:', err);
            return res.status(500).json({ message: 'Error searching for posts' });
        }

        // Filter out any recipes that still match the allergies entered by user
        const filteredResults = results.filter(recipe => {
            // For each recipe, make sure it doesnt contain any allergies
            return !allergiesList.some(allergy => recipe.recipe.toLowerCase().includes(allergy.replace(/%/g, '')));
        });

        res.json(filteredResults);
    });
});

app.get("/UserProfile", (req, res) => {
    const { email } = req.query;
    console.log("Received email query:", email); // Log the received email query
  
    if (!email) {
      console.log('Email parameter is missing.'); // Additional log for missing email
      return res.status(400).json({ message: "Email is required." });
    }
  
    const query = "SELECT displayName, profilePicture FROM Users WHERE Email = ?";
    
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ message: "Failed to fetch profile." });
      }
    
      if (results.length > 0) {
        console.log('User found:', results[0]); // Log found user data
        // Do not prepend the `uploads/` path here, send only the file name
        res.json(results[0]);
      } else {
        console.log('User not found for email:', email); // Log when no user is found
        res.status(404).json({ message: "User not found." });
      }
    });
});

app.get('/posts/:postId', (req, res) => {
    const { postId } = req.params;
    const query = 'SELECT * FROM Posts WHERE id = ?';

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error('Error fetching post:', err);
            return res.status(500).send('Error fetching post');
        }
        if (results.length === 0) {
            return res.status(404).send('Post not found');
        }

        // Assuming the comments are stored in a JSON formatted column named 'Comments'
        const post = results[0];

        // Safely parse the JSON to handle cases where it might be null or improperly formatted
        try {
            post.comments = JSON.parse(post.Comments || '[]');
        } catch (parseError) {
            console.error('Error parsing comments:', parseError);
            post.comments = []; // Default to an empty array if there's a parsing error
        }

        res.json(post);
    });
});

app.post('/posts/:postId/like', (req, res) => {
    const postId = req.params.postId;
    const userEmail = req.body.email;

    if (!userEmail) {
        console.log('Like Request: No email provided');
        return res.status(400).send('Email is required');
    }

    console.log(`Like Request: Attempting to like post ${postId} by user ${userEmail}`);

    const checkUserQuery = 'SELECT liked_posts FROM Users WHERE Email = ?';
    db.query(checkUserQuery, [userEmail], (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).send('Error checking user');
        }

        if (results.length === 0) {
            console.log('No user found with the email:', userEmail);
            return res.status(404).send('User not found');
        }

        let likedPosts = JSON.parse(results[0].liked_posts || '[]');
        console.log(`User found. Current liked posts: ${likedPosts}`);

        if (likedPosts.includes(postId)) {
            console.log('Post already liked by user:', userEmail);
            return res.status(400).send('Post already liked');
        }

        const incrementLikesQuery = 'UPDATE Posts SET likes = likes + 1 WHERE id = ?';
        db.query(incrementLikesQuery, [postId], (err, result) => {
            if (err) {
                console.error('Error incrementing likes for post:', err);
                return res.status(500).send('Error updating post likes');
            }

            if (result.affectedRows === 0) {
                console.log('No post found with ID:', postId);
                return res.status(404).send('Post not found');
            }

            console.log(`Likes incremented for post ${postId}`);
            likedPosts.push(postId);
            const updateUserLikesQuery = 'UPDATE Users SET liked_posts = ? WHERE Email = ?';
            db.query(updateUserLikesQuery, [JSON.stringify(likedPosts), userEmail], (err, result) => {
                if (err) {
                    console.error('Error updating user likes:', err);
                    return res.status(500).send('Error updating user likes');
                }
                console.log(`Liked posts updated successfully for user ${userEmail}`);
                res.send('Post liked successfully');
            });
        });
    });
});



app.get('/UserProfile/:email/liked-posts', (req, res) => {
    const userEmail = req.params.email;
    console.log(`Fetching liked posts for user: ${userEmail}`);

    const getUserLikedPostsQuery = 'SELECT liked_posts FROM Users WHERE Email = ?';
    db.query(getUserLikedPostsQuery, [userEmail], (err, userResults) => {
        if (err) {
            console.error('Error fetching user liked posts:', err);
            return res.status(500).send('Error fetching liked posts');
        }

        if (userResults.length === 0) {
            console.log('No user found with the email:', userEmail);
            return res.status(404).send('User not found');
        }

        const likedPostsIds = JSON.parse(userResults[0].liked_posts || '[]');
        console.log(`Liked posts IDs for user ${userEmail}:`, likedPostsIds);

        if (likedPostsIds.length === 0) {
            console.log('No liked posts for user:', userEmail);
            return res.json([]); // No liked posts, return empty array
        }

        // Dynamic SQL query construction for the IN clause
        const placeholders = likedPostsIds.map(() => '?').join(',');
        const postsQuery = `SELECT * FROM Posts WHERE id IN (${placeholders});`;

        db.query(postsQuery, likedPostsIds, (err, postsResults) => {
            if (err) {
                console.error('Error fetching posts:', err);
                return res.status(500).send('Error fetching posts');
            }
            console.log(`Posts fetched for user ${userEmail}:`, postsResults);
            res.json(postsResults);
        });
    });
});

app.post('/posts/:postId/unlike', (req, res) => {
    const postId = req.params.postId;  // Keep postId as a string to match the database storage format
    const userEmail = req.body.email;

    if (!userEmail) {
        return res.status(400).send('Email is required');
    }

    console.log(`Unliking post ${postId} for user ${userEmail}`);

    db.query('SELECT liked_posts FROM Users WHERE Email = ?', [userEmail], (err, results) => {
        if (err) {
            console.error('Database error when fetching user:', err);
            return res.status(500).send('Database error when fetching user');
        }
        if (results.length === 0) {
            console.log('No user found with the email:', userEmail);
            return res.status(404).send('User not found');
        }

        let likedPosts = JSON.parse(results[0].liked_posts || '[]');
        if (!likedPosts.includes(postId)) {  // Check for postId as a string
            console.log('Post not previously liked:', postId);
            return res.status(400).send('Post not previously liked');
        }

        // Remove the postId from the liked posts array using filter
        likedPosts = likedPosts.filter(item => item !== postId);

        db.query('UPDATE Users SET liked_posts = ? WHERE Email = ?', [JSON.stringify(likedPosts), userEmail], (updateErr, updateResults) => {
            if (updateErr) {
                console.error('Error updating user likes:', updateErr);
                return res.status(500).send('Error updating user likes');
            }
            if (updateResults.affectedRows === 0) {
                console.log('No user update performed:', userEmail);
                return res.status(404).send('No user update performed');
            }

            // Optionally decrement the likes count on the post
            db.query('UPDATE Posts SET likes = likes - 1 WHERE id = ?', [postId], (postErr, postResults) => {
                if (postErr) {
                    console.error('Error decrementing post likes:', postErr);
                    return res.status(500).send('Error decrementing post likes');
                }
                console.log('Post unliked successfully:', postId);
                res.send('Post unliked successfully');
            });
        });
    });
});



function isInappropriate(text) {
    // List of banned words example
    const bannedWords = ['sucks', 'awful', 'terrible','loser', 'hate', ];
    // Check if the comment contains any banned words
    return bannedWords.some(word => text.toLowerCase().includes(word.toLowerCase()));
}

app.post('/posts/:postId/comments', (req, res) => {
    const { postId } = req.params;
    const { email, comment } = req.body;

    if (!email || !comment) {
        return res.status(400).send('Email and comment are required.');
    }

    if (isInappropriate(comment)) {
        return res.status(400).send('Error posting comment: Inappropriate content detected.');
    }

    // Retrieve displayName from the Users table based on the email
    const userQuery = 'SELECT displayName FROM Users WHERE Email = ?';
    db.query(userQuery, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Failed to fetch user details.');
        }
        if (results.length === 0) {
            return res.status(404).send('User not found.');
        }

        const displayName = results[0].displayName;
        const commentObject = { displayName, comment };

        // Ensure comments is initialized as an empty array if it is null
        const ensureCommentsArray = `
            UPDATE Posts
            SET Comments = '[]'
            WHERE id = ? AND Comments IS NULL
        `;

        db.query(ensureCommentsArray, [postId], (err, result) => {
            if (err) {
                console.error('Error initializing comments:', err);
                return res.status(500).send('Failed to initialize comments.');
            }

            // Append the new comment to the Comments JSON column in the Posts table
            const updateQuery = `
                UPDATE Posts
                SET Comments = JSON_ARRAY_APPEND(Comments, '$', CAST(? AS JSON))
                WHERE id = ?
            `;

            db.query(updateQuery, [JSON.stringify(commentObject), postId], (err, result) => {
                if (err) {
                    console.error('Error updating comments:', err);
                    return res.status(500).send('Failed to add comment.');
                }
                res.status(200).send({ message: 'Comment added successfully', comment: commentObject });
            });
        });
    });
});

app.post("/submit-rating", (req, res) => {
    const { email, rating } = req.body;
    if (!email || rating == null) {
        return res.status(400).send({ message: "Email and rating are required." });
    }

    const checkQuery = 'SELECT rating FROM Ratings WHERE email = ?';
    db.query(checkQuery, [email], (err, results) => {
        if (err) return res.status(500).send({ message: "Database error" });

        if (results.length > 0) {
            const updateRatingQuery = 'UPDATE Ratings SET rating = ? WHERE email = ?';
            db.query(updateRatingQuery, [rating, email], (error) => {
                if (error) return res.status(500).send({ message: "Failed to update rating" });
                updateAverageRating(db, res);
            });
        } else {
            const insertRatingQuery = 'INSERT INTO Ratings (email, rating) VALUES (?, ?)';
            db.query(insertRatingQuery, [email, rating], (error) => {
                if (error) return res.status(500).send({ message: "Failed to insert rating" });
                updateAverageRating(db, res);
            });
        }
    });
});

function updateAverageRating(db, res) {
    const calcAverageQuery = 'SELECT AVG(rating) AS average FROM Ratings';
    db.query(calcAverageQuery, (error, results) => {
        if (error) return res.status(500).send({ message: "Failed to calculate average rating" });
        const averageRating = results[0].average;
        const updateMetricQuery = 'UPDATE AppMetrics SET metric_value = ? WHERE metric_name = "AverageRating"';
        db.query(updateMetricQuery, [averageRating], (error) => {
            if (error) return res.status(500).send({ message: "Failed to update average rating metric" });
            res.send({ message: "Rating submitted/updated successfully", averageRating });
        });
    });
}

app.post('/reports', (req, res) => {
    const { user_email, report_area, report_details, postID } = req.body;

    const insertReportQuery = "INSERT INTO Reports (postID, reportArea, reportContent, reporter) VALUES (?, ?, ?, ?)";

    try {
        db.query(insertReportQuery, [postID, report_area, report_details, user_email], (err, result) => {
            if (err) {
                console.error('Database error during report submission:', err);
                return res.status(500).json({ message: 'Error submitting the report' });
            }
            res.status(201).json({ message: 'Report submitted successfully', result });
        });
    } catch (err) {
        console.error('Error during report submission:', err);
        res.status(500).json({ message: 'Error submitting the report' });
    }
});

app.get("/reports", (req, res) => {
    const q ="SELECT * FROM recipeRouletteDb.Reports";
    db.query(q, (err, data) => {
        if(err) return  res.json(err);
        return res.json(data);
    })
})

app.get("/reports/:id", (req, res) => {
    const reportID = req.params.id
    const q = "SELECT * FROM Reports WHERE reportID = ?"

    db.query(q, [reportID], (err, data) => {
        if(err)     return res.json(err)
        return res.json(data)
    })
})

app.delete("/reports/:id", (req, res) => {
    const reportID = req.params.id
    const q = "DELETE FROM Reports WHERE reportID = ?"

    db.query(q, [reportID], (err, data) => {
        if(err)     return res.json(err)
        return res.json("Report has been deleted successfully")
    })
})



app.listen(8800, () => {
    console.log("connected to backend");
})
