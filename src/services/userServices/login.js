// This code implements the logic for a login service.

// Importing necessary modules and functions from firebase/auth and firebaseConfig 
const { signInWithEmailAndPassword } = require('firebase/auth');
const { firebaseAuth } = require('../../configs/firebaseConfig');

// Importing the HttpStatusCode utility module
const HttpStatusCode = require('../../utils/HttpStatusCode');

// Defining the loginService function which handles the login logic
const loginService = async (req, res) => {
  // Logging the request body
  console.log(req.body);
  
  // Destructuring the email and password from the request body
  const loginUser = req.body

  // Checking if the email and password are present in the request body
  if (!(loginUser.email && loginUser.password)) {
    // Responding with a 400 Bad Request error if either the email or password is missing
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: 'All inputs are required.',
      data: null
    });
  }

  // Wrapping the logic in a try-catch block
  try {
    // Signing in the user with the provided email and password using firebaseAuth
    const credential = await signInWithEmailAndPassword(firebaseAuth, loginUser.email, loginUser.password);
    
    // Destructuring the user object from the credential
    const user = credential.user;

    // Checking if the email is verified
    if (!user.emailVerified) {
      // Responding with a 403 Forbidden error if the email is not verified
      res.status(HttpStatusCode.FORBIDDEN).json({
        message: 'Email not verified.',
        data: null
      });
    }

    // Responding with a 200 OK status code and the refreshToken if the login is successful
    res.status(HttpStatusCode.OK).json({
      message: 'Login successfully.',
      data: user.refreshToken
    });
  } catch (error) {
    // Logging the error
    console.log(error.message)

    // Responding with a 401 Unauthorized error if the login fails
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      message: 'Email or password is incorrect.',
      data: null
    });
  }
};

// Exporting the loginService function
module.exports = loginService;
