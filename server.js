const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 8001;

app.use(bodyParser.json());
app.use(cors());

const users = [];
const poems = [];

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const normalizeText = (text) => String(text || '').trim();
const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const JWT_SECRET = process.env.JWT_SECRET || 'byte_local_secret';

const createToken = (user) => jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '2h' }
);

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token required' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = users.find(item => item.id === payload.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

const getUserFromToken = (req) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
        return null;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return users.find(item => item.id === payload.id) || null;
    } catch (error) {
        return null;
    }
};

app.post('/auth/register', (req, res) => {
    const firstname = normalizeText(req.body.firstname);
    const lastname = normalizeText(req.body.lastname);
    const email = normalizeEmail(req.body.email);
    const password = normalizeText(req.body.password);

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = { id: createId(), firstname, lastname, email, password };
    users.push(user);
    const token = createToken(user);
    return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: { id: user.id, firstname, lastname, email },
        token
    });
});

app.post('/auth/login', (req, res) => {
    const usernameOrEmail = normalizeText(req.body.usernameOrEmail);
    const password = normalizeText(req.body.password);

    if (!usernameOrEmail || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const loginKey = normalizeEmail(usernameOrEmail) || usernameOrEmail;
    const user = users.find(
        user =>
            (user.email === loginKey || user.firstname.toLowerCase() === loginKey.toLowerCase()) &&
            user.password === password
    );

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = createToken(user);
    return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email },
        token
    });
});

app.get('/auth/me', authenticate, (req, res) => {
    const user = req.user;
    return res.status(200).json({
        success: true,
        user: { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email }
    });
});

app.get('/poems', (req, res) => {
    const orderedPoems = poems.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return res.status(200).json({ success: true, poems: orderedPoems });
});

app.post('/poems', (req, res) => {
    const title = normalizeText(req.body.title);
    const content = normalizeText(req.body.content);
    const tokenUser = getUserFromToken(req);
    const author = tokenUser
        ? `${tokenUser.firstname} ${tokenUser.lastname}`.trim() || tokenUser.email
        : normalizeText(req.body.author);

    if (!title || !content || !author) {
        return res.status(400).json({ success: false, message: 'Title, content, and author are required' });
    }

    if (title.length < 3 || title.length > 120) {
        return res.status(400).json({ success: false, message: 'Title must be 3-120 characters' });
    }

    if (content.length < 20 || content.length > 2000) {
        return res.status(400).json({ success: false, message: 'Content must be 20-2000 characters' });
    }

    const poem = {
        id: createId(),
        title,
        content,
        author,
        createdAt: new Date().toISOString()
    };

    poems.push(poem);
    return res.status(201).json({ success: true, message: 'Poem published successfully', poem });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
