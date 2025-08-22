import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password, // Hashing is handled by pre-save middleware
        });

        if (user) {
            res.status(201).json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                currency: user.currency,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // For demo purposes, create the user if they don't exist on first login
    if(email === 'demo@findash.com' && !(await User.findOne({ email }))) {
        await User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'demo@findash.com',
            password: 'password', // will be hashed on save
        });
        console.log('Demo user created.');
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            currency: user.currency,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            currency: user.currency,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.currency = req.body.currency || user.currency;

        const updatedUser = await user.save();

        res.json({
            id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            currency: updatedUser.currency,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};


export { registerUser, loginUser, getMe, updateUserProfile };