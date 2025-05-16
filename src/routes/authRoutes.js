import express from 'express';
import User from '../models/User.js'; // importing the User model to interact with the database
import jwt from 'jsonwebtoken'; // importing jsonwebtoken to create and verify tokens

const router = express.Router(); // creates a new instance of the Express Router,
// which is a middleware system that allows you to organize and modularize your routes.

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '14d'});
}

router.post('/register', async (req, res) => {
    try {
        const {email, username, password } = req.body; // destructuring the request body to get username and password

        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //Get random avatar
        const randomAvatar = `https://api.dicebear.com/9.x/open-peeps/svg`;

        // Create new user
        const user = new User({
            email,
            username,
            password,
            profileImage: randomAvatar,
        });
        await user.save();
        const token = generateToken(user._id); // Generate a token for the user

        res.status(201).json({
            token, // Send the token back to the client
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({message : "All fields are required"});
        }
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id); // Generate a token for the user

        res.status(200).json({
            token, // Send the token back to the client
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            },
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;