import registerService from "../services/userServices/register";
import { StatusCodes } from 'http-status-codes'

const registerUser = async (req, res) => {
	try {
		// Extract user information from the request body
		const newUser = req.body;

		// Validate that all inputs are provided
		if (!(newUser.email && newUser.password && newUser.fullName)) {
			res.status(StatusCodes.BAD_REQUEST).json({
				message: 'All inputs are required.',
				data: null
			});
		}
		// Call service
		await registerService(newUser)
		// Return success message
		res.status(StatusCodes.OK).json({
			message: 'Create account successfully.',
			data: null
		});
	} catch (error) {
		// Log error message
		console.error('Error creating new user:', error.message);

		// Return error message if email already exists
		res.status(StatusCodes.CONFLICT).json({
			message: 'Email already exists.',
			data: null
		});
	}
};

module.exports = {
	registerUser,
};
