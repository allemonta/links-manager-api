const jwt = require('jsonwebtoken')
const userDB = require('../db/user')

const JWT_SECRET = process.env.JWT_SECRET || 'token_poco_veritiero'

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await userDB.getUserByIdAndToken(decoded.id, token)
        if (!user) {
            throw new Error()
        }

        req.user = user
        next()
    } catch (e) {
        res.send({ error: 'Please authenticate', isAuthenticated: false })
    }
}

module.exports = auth