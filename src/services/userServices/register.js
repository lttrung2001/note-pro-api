// This is a service for registering a new user in a Firebase application. 
// The service takes a request and response object as parameters and expects the request's body to contain an "email" and "password" field. 
// It then creates a new user with the provided email and password using the Firebase Auth createUserWithEmailAndPassword() method and sends an email verification to the user. 
// If there is an error, it logs the error and sends a response with a status code of 409 and a message of "Email already exists." 
// The service is exported as a module to be used in other parts of the application.

const firebaseApp = require('./configs/firebaseConfig')
const firebaseAuth = require('firebase/auth')
const auth = firebaseAuth.getAuth(firebaseApp)

const registerService = async (req, res) => {
    const account = {
        email: req.body.email,
        password: req.body.password
        // Full name
    }

    if (!(account.email || account.password)) {
        res.statusCode = 400
        res.message = 'Email and password are required.'
        res.send(null)
    }
    try {
        const credential = await firebaseAuth.createUserWithEmailAndPassword(auth, account.email, account.password)
        const user = credential.user
        console.log('Successfully created new user:', user);
        firebaseAuth.sendEmailVerification(user)
        res.statusCode = 200
        res.message = 'Create account successfully.'
        res.send(null)
    } catch(error) {
        console.log('Error creating new user:', error);
        res.statusCode = 409
        res.message = 'Email already exists.'
        res.send(null)
    }
}

module.exports = registerService