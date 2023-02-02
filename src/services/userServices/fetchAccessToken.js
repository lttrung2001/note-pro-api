const HttpStatusCode = require("../../utils/HttpStatusCode")
const request = require('request')

const fetchAccessTokenService = async (req, res) => {
    const authorization = req.headers.authorization
        const token = authorization.split(' ')[1]
        if (!token) {
            res.status(HttpStatusCode.BAD_REQUEST).json({
                message: 'Token required.',
                data: null
            })
        }
        request.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyDKwh8lcC5jFJcFDtImtzVx0Bk7DQGL0yc', {
            json: true, body: {
                grant_type: 'refresh_token',
                refresh_token: token
            }
        }, (error, response, body) => {
            if (error) {
                console.log(error.message)
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                    message: error.message,
                    data: null
                })
            } else if (response.statusCode == HttpStatusCode.OK) {
                console.log(body)
                res.status(HttpStatusCode.OK).json({
                    message: 'Get access token successfully.',
                    data: body.id_token
                })
            } else {
                console.log(body)
                res.status(body.error.code).json({
                    message: body.error.message,
                    data: null
                })
            }
        })
}

module.exports = fetchAccessTokenService