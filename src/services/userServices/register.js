// This code implements the logic for a register service.

// Import firebase authentication functions and HttpStatusCode utils
const { sendEmailVerification, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const HttpStatusCode = require('../../utils/HttpStatusCode');

// Define the registerService function
const registerService = async (req, res) => {
    // Extract user information from the request body
    const newUser = req.body;

    // Validate that all inputs are provided
    if (!newUser.email || !newUser.password || !newUser.fullName) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: 'All inputs are required.',
            data: null
        });
        return;
    }

    try {
        // Create a new user with email and password
        const credential = await createUserWithEmailAndPassword(firebaseAuth, newUser.email, newUser.password);
        const user = credential.user;

        // Update the user profile with displayName
        await updateProfile(user, {
            displayName: req.body.fullName
        });

        // Send email verification to the new user
        sendEmailVerification(user);

        // Return success message
        res.status(HttpStatusCode.OK).json({
            message: 'Create account successfully.',
            data: null
        });
    } catch(error) {
        // Log error message
        console.error('Error creating new user:', error);

        // Return error message if email already exists
        res.status(HttpStatusCode.CONFLICT).json({
            message: 'Email already exists.',
            data: error.message
        });
    }
};

// Export the registerService function
module.exports = registerService;