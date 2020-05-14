const express = require('express')
const auth = require('../middleware/auth')
const sectionDB = require('../db/section')
const router = new express.Router()
const { runAsyncWrapper } = require('../utils/asyncWrapper')

router.get('/sections/:id', runAsyncWrapper(async (req, res) => {
    let id = req.params.id
    if (!id)
        throw new Error("please provide an id")

    let section = await sectionDB.getSectionById(id)
    res.send({section: section})
}))

router.delete('/sections/:id', auth, runAsyncWrapper(async (req, res) => {
    let id = req.params.id
    if (!id)
        throw new Error("please provide an id")

    let result = await sectionDB.deleteSection(id)
    res.send({deleted: result})
}))

router.post('/sections', auth, runAsyncWrapper(async (req, res) => {
    let { title, description, visible, idPage } = req.body.section

    let result = await sectionDB.addSection(title, description, visible, idPage);
    res.send({section: result})

}))

router.patch('/sections', auth, runAsyncWrapper(async (req, res) => {
    let { id, title, description, visible } = req.body.section

    result = await sectionDB.updateSection(id, title, description, visible)
    res.send({update: result})
}))


module.exports = router