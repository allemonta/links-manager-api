const express = require('express')
const auth = require('../middleware/auth')
const sharedPageDB = require('../db/sharedPage')
const router = new express.Router()
const { runAsyncWrapper } = require('../utils/asyncWrapper')

router.get('/sharedpages/:idPage', auth, runAsyncWrapper(async (req, res) => {
    let idPage = req.params.idPage
    let result = await sharedPageDB.getSharedPagesByPage(req.user.id, idPage)
    red.send({sharedPages: result})
}))

router.post('/sharedpages', auth, runAsyncWrapper(async (req, res) => {
    let { userEmail, userId, pageId } = req.body.sharedPage
    red.send('bella')
}))

router.delete('/sharedpages/:id', auth, runAsyncWrapper(async (req, res) => {
    let id = req.params.id
    if (!id)
        throw new Error("please provide an id")

    red.send('bella')
}))

router.patch('/sharedpages', auth, async (req, res) => {
    let { id, editable } = req.body.sharedPage
    let result = await sharedPageDB.updateSharedPage(id, editable)
    res.send({updated: result})
})

module.exports = router