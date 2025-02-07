# Recipe Roulette User Manual

This document serves as a guide to the usage of the Recipe Roulette Web Application

# Launching the App

To launch the app, open the Recipe-Roulette folder in VS Code. Create two terminals in VS code. Navigate one to the frontend using "cd frontend" and navigate the other to the backend using "cd backend". Type "npm start" into both terminals to launch the frontend and the backend.

# Getting Started

By default, the website will navigate you to the login page. If already have an account, enter your credentials and you will be redirected to the Home page. If you don't have an account, click the "Create an Account" link below the login form.

To create an account, you must enter a valid username and password. A valid username is one that abides by the RFC 2822 email standard. A valid password is at least 8 characters, with at least one uppercase character, one lowercase character, one number, and one special character. Users can optionally enter a display name, their favorite food, a comma separated list of allergies, and a profile picture in their respective fields on the form. If a user already has an account, they can navigate to the login page using the "Log In" link.

# The Home Page

Once logged in, users will see the Home page. In the center of the screen they should see a "Post of the Day", which picks from the database of posts from all users. Clicking on this post navigates users to the Posts page of the website. Below the "Post of the Day", there is a button labeled "Create New Post", which will navigate users to the CreatePost page when clicked.

# The Navbar

While users are logged in, the Navbar will appear at the top of their screen. This Navbar contains links to the application's pages. Clicking on the "Recipe Roulette" text in the far left will navigate users to the Home page along with the link labeled "Home". The "Switch Mode" button to the right of these links will alternate the website's view mode between light mode and dark mode when clicked. At the far right of the Navbar, there is a dropdown menu with the user's profile picture and display name. This dropdown menu will allow the user to navigate to their profile page and logout.

# Creating a Post

The CreatePost page contains a form for users to enter the data that makes up a post. The title, description, instructions, and nutritional information are entered as regular text. The ingredients are entered as a comma-separated list. The picture used for the post is uploaded from the user's device. After all this information is entered, users press the submit post to add it to the database and share with the website.

# The Posts Page

The Posts page is where users can see a collection of all the posts that have been made. Clicking on a post's title will navigate the user to that specific post, where they can interact with it.

# Interacting with Posts

Users can like and comment on specific posts after navigating to them. Clicking the like button on that post increases the its like counter and gives the user the option to unlike the post. Users can also create comments by typing them in the textbox and pressing the "Post Comment" button. These comments are displayed in a box below the post. A user can click the "Back" button in the top left corner to return to the Posts page.

# The Profile Management Page

The Profile Management page is where users can edit their display name, allergies, favorite food, allergies, and profile picture. To do this, they must enter their email in the first box. After submitting the form with the "Update Profile" button, the user profile's current attributes will be replaced with what they entered.

# The Search Page

The search page allows users to search for posts using a list of ingredients and allery restrictions. Both the ingredients and allergies are provided one at a time by entering it in the provided text box and pressing the "Add Ingredient/Allergy" button. After adding an ingredient or allergy, it will appear in a gray bubble under its respective button. These can be removed by clicking the "x" on the right side of the bubble. After the user has entered these, they can click the "Search" button and the search function returns all posts including the given ingredients and not including the given allergies.

# The About Page

The about page briefly describes the website, and gives users the opportunity to rate their experience with the website on a scale from 1-5, with 1 being poor and 5 being excellent.

# User Profile Page

The user's profile page shows their display name, profile picture, and favorite food. It also gives users the opportunity to view their posts and posts they've liked. Users can remove posts from their liked posts and update or delete the posts they have made. The process of updating a post is similar to creating one.

# Logging Out

To logout, press the logout link in the dropdown menu of the Navbar and the user will be returned to the login page.