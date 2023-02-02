const express = require('express')
const fileUpload = require('express-fileupload')
const registerService = require('./services/userServices/register')
const loginService = require('./services/userServices/login')
const fetchAccessTokenService = require('./services/userServices/fetchAccessToken')

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

app.get('/test/register', async (req, res) => {
   return registerService(req, res)
})

app.get('/test/login', async (req, res) => {
   return loginService(req, res)
})

app.get('/test/fetch-access-token', async (req, res) => {
   return fetchAccessTokenService(req, res)
})

app.listen(process.env.PORT || 3000, () => {
   console.log(`Server is listening on port: ${process.env.PORT || 3000}`)
})