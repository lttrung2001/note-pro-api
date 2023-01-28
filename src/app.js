/**
This code creates an Express.js web server and uses the "express-fileupload" middleware
to handle file uploads. The server is set to listen on either the port specified by the
"process.env.PORT" environment variable or port 3000. It also sets limits for file size and
number of files to 2MB and 10 respectively. The other middleware used are express.json() and
express.urlencoded() for handling json and urlencoded data respectively.
*/
const express = require('express')
const fileUpload = require('express-fileupload')
const { credential } = require('firebase-admin')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload({
   responseOnLimit: null, // Response when face limit exception
   abortOnLimit: true, // Return 413 when face limit exception
   limitHandler: null, // Handle limit exception
   limits: {
      fileSize: 1024 * 1024 * 2, // File size
      files: 10 // Maxmimum files uploading at the same time
   }
}))

app.get('/test/register', (req, res) => {
   const firebaseApp = require('./configs/firebaseConfig')
   const firebaseAuth = require('firebase/auth')
   const auth = firebaseAuth.getAuth(firebaseApp)
   firebaseAuth.createUserWithEmailAndPassword(auth, 'lt.trung2001@gmail.com', '123456').then((credential) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log('Successfully created new user:', credential.user);
      firebaseAuth.sendEmailVerification(credential.user)
      res.status(200).json({ message: 'Successfully created new user' })
   }).catch(function (error) {
      console.log('Error creating new user:', error);
      res.status(500).json({ message: 'Error creating new user' })
   })
})

app.get('/test/login', (req, res) => {
   const firebaseApp = require('./configs/firebaseConfig')
   const firebaseAuth = require('firebase/auth')
   const auth = firebaseAuth.getAuth(firebaseApp)
   firebaseAuth.signInWithEmailAndPassword(auth, 'lt.trung2001@gmail.com', '123456').then((credential) => {
      res.status(200).json({data: credential.user})
   }).catch((error) => {
      res.status(200).json({data: error.message})
   })
})

app.listen(process.env.PORT || 3000, () => {
   console.log(`Server is listening on port: ${process.env.PORT || 3000}`)
})