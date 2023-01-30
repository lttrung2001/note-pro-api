const express = require('express')
const fileUpload = require('express-fileupload')

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

})

})

app.listen(process.env.PORT || 3000, () => {
   console.log(`Server is listening on port: ${process.env.PORT || 3000}`)
})