
const express = require('express')
const router = new express.Router()

const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'token_poco_veritiero'

const googleUtil = require('../utils/google-util')
const userDB = require('../db/user')
const auth = require('../middleware/auth')


router.get('/google/generateurl', async (req, res) => {
    res.send({
        url: googleUtil.authenticationUrl()
    })
})

router.post('/google/oauthcallback', async (req, res) => {
    let { code, scope } = req.body
    if (!code)
        return res.send({ error: 'Questo link serve per inviare il codice rilasciato da google' })

    let tokens = await googleUtil.getTokensByCode(code)
    let profile = (await googleUtil.getProfile(tokens)).data

    const apiToken = jwt.sign({ id: profile.id }, JWT_SECRET)

    let user = await userDB.getUserById(profile.id)
    let saved = true
    if (!user) {
        saved = await userDB.addUser(
            profile.id, 
            profile.given_name, 
            profile.family_name, 
            profile.email, 
            profile.picture, 
            JSON.stringify(tokens),
            apiToken
        )
    } else {
        saved = saved && await userDB.setGoogleToken(profile.id, JSON.stringify(tokens))
        saved = saved && await userDB.setApiToken(profile.id, apiToken)
    }

    res.send({ apiToken, profile })
})

router.get('/google/user', auth, (req, res) => {
    delete req.user.token
    delete req.user.googleToken

    res.send({
        user: req.user,
        isAuthenticated: true
    })
})

module.exports = router