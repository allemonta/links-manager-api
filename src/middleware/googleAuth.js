const userDB = require('../db/user')
const {verifyTokens} = require('../utils/google-util')

const googleAuth = async (req, res, next) => {
    try {
        if (!req.user.googleToken || req.user.googleToken == null || !req.user.googleToken.trim())
            throw new Error('1')

        let tokens = JSON.parse(req.user.googleToken)
        let result = await verifyTokens(tokens.access_token)

        if (!result.expires_in)
            throw new Error('2')

        req.googleTokens = tokens

        next()
    } catch (e) {
        userDB.setGoogleToken(req.user.id, '')
        res.send({ error: 'Please authenticate with google', isAuthenticated: false })
    }
}

module.exports = googleAuth