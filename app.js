const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Use EJS as the view engine
app.set('view engine', 'ejs');
const postsFilePath = path.join(__dirname, 'data', 'jokes.json');
// Serve static files from the public directory
app.use(express.static('public'));

// Parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data (replace this with a database)
let posts = [];



const readPosts = () => {
    try {
        const postsData = fs.readFileSync(postsFilePath, 'utf-8');
        return JSON.parse(postsData);
    } catch (error) {
        console.error('Error reading posts:', error);
        return [];
    }
};


const writePosts = (posts) => {
    try {
        const jsonData = JSON.stringify(posts, null, 2);
        fs.writeFileSync(postsFilePath, jsonData, 'utf-8');
    } catch (error) {
        console.error('Error writing posts:', error);
    }
};







// Render the homepage
app.get('/', (req, res) => {
    const posts = readPosts();
    res.render('index', { posts });
});
// Handle post submission
app.post('/submit', (req, res) => {
    const { postTitle, postContent } = req.body;

    // Read existing posts
    const posts = readPosts();

    // Create a new post and add it to the array
    const newPost = { title: postTitle, content: postContent };
    posts.push(newPost);

    // Write the updated posts back to the JSON file
    writePosts(posts);

    // Redirect to the homepage
    res.redirect('/');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});