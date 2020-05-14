const express = require('express')
const auth = require('../middleware/auth')
const pageDB = require('../db/page')
const router = new express.Router()
const { runAsyncWrapper } = require('../utils/asyncWrapper')

router.get('/pages', auth, runAsyncWrapper(async (req, res) => {
    let pages = await pageDB.getpagesByUser(req.user.id)
    res.send({pages})
}))

router.get('/pages/:id', runAsyncWrapper(async (req, res) => {
    let id = req.params.id

    let page = await pageDB.getPageById(id)
    res.send({page})
}))

router.delete('/pages/:id', auth, runAsyncWrapper(async (req, res) => {
    let id = req.params.id

    let result = await pageDB.deletePage(id)
    res.send({deleted: result})
}))

router.post('/pages', auth, runAsyncWrapper(async (req, res) => {
    let { title, description } = req.body.page

    let result = await pageDB.addPage(title, description, req.user.id);
    res.send({ page: result})
}))

router.patch('/pages', auth, runAsyncWrapper(async (req, res) => {
    let {id, title, description} = req.body.page
    // if (!id || !title || !description)
        // throw new Error('Please provide id, title, description')

    let result = await pageDB.updatepage(id, title, description)
    res.send({update: result})
}))

module.exports = router