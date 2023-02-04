// This code implements the logic for a register service.

// Import firebase authentication functions and StatusCodes utils
import { sendEmailVerification, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { firebaseAuth } from '../../configs/firebaseConfig'

// Define the registerService function
const registerService = async (newUser) => {
    // Create a new user with email and password
    const credential = await createUserWithEmailAndPassword(firebaseAuth, newUser.email, newUser.password);
    const user = credential.user;

    // Update the user profile with displayName
    await updateProfile(user, {
        displayName: newUser.fullName
    });

    // Send email verification to the new user
    sendEmailVerification(user);
};

// Export the registerService function
module.exports = registerService;