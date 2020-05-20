const express = require('express')
const auth = require('../middleware/auth')
const itemDB = require('../db/item')
const router = new express.Router()
const { runAsyncWrapper } = require('../utils/asyncWrapper')

router.get('/items/:idSection', runAsyncWrapper(async (req, res) => {
    let idSection = req.params.idSection
    if (!idSection)
        throw new Error('Please give a section ID')

    let items = await itemDB.getItemsBySection(idSection)
    res.send(items)

}))

router.post('/items', auth, runAsyncWrapper(async (req, res) => {
    let { title, path, visible, nested, idSection } = req.body.item
    if (!title || !path || !idSection)
        throw new Error('Please give an item')

    /* TODO check user scope */
    let result = await itemDB.addItem(title, path, visible, nested, idSection)
    res.send({item: result})
}))

router.post('/itemsPosition', auth, runAsyncWrapper(async (req, res) => {
    let { itemsPosition } = req.body
    let result = await itemDB.updateItemPositions(itemsPosition)
    res.send({result: result})
}))

router.delete('/items/:id', runAsyncWrapper(async (req, res) => {
    let id = req.params.id
    if (!id)
        throw new Error("please provide an id")

    /* TODO check user scope */
    let result = await itemDB.deleteItem(id)
    res.send({deleted: result})
}))

router.patch('/items', async (req, res) => {
    let { id, title, path, visible, nested } = req.body.item

    let result = await itemDB.updateItem(id, path, title, visible, nested)
    res.send({update: result})
})

module.exports = router