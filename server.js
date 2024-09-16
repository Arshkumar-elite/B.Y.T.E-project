const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8001;

app.use(bodyParser.json());
app.use(cors());

// Mock database for simplicity
const users = [];
const poems = [];

// Registration route
app.post('/auth/register', (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    users.push({ firstname, lastname, email, password });
    return res.status(201).json({ success: true, message: 'Registration successful' });
});

// Login route
app.post('/auth/login', (req, res) => {
    const { usernameOrEmail, password } = req.body;
    const user = users.find(user => (user.email === usernameOrEmail || user.firstname === usernameOrEmail) && user.password === password);

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    return res.status(200).json({ success: true, message: 'Login successful' });
});

// Poem publishing route
app.post('/poems', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    poems.push({ title, content });
    return res.status(201).json({ success: true, message: 'Poem published successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
