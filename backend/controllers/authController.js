const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

exports.registerUser = async (req, res) => {
    try {
        const { Name, Email, Password } = req.body;
        
        const userExists = await User.findOne({ Email });
        if (userExists) {
            return res.status(400).json({ message: 'Duplicate email registration' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        
        const user = await User.create({
            Name,
            Email,
            Password: hashedPassword
        });
        
        if (user) {
            res.status(201).json({
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email });
        
        if (user && (await bcrypt.compare(Password, user.Password))) {
            res.json({
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid login credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
