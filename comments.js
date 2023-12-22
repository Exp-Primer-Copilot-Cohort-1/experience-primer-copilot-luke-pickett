// Create web server
// 1. Import express
const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')
const User = require('../models/user')
const { authenticated } = require('../config/auth')

// 2. Create router
router.post('/', authenticated, (req, res) => {
  const comment = Comment({
    text: req.body.text,
    restaurantId: req.body.restaurantId,
    userId: req.user._id
  })
  comment.save(err => {
    if (err) return console.error(err)
    return res.redirect(`/restaurants/${req.body.restaurantId}`)
  })
})

router.delete('/:id', authenticated, (req, res) => {
  Comment.findById(req.params.id, (err, comment) => {
    if (err) return console.error(err)
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.redirect(`/restaurants/${comment.restaurantId}`)
    }
    comment.remove(err => {
      if (err) return console.error(err)
      return res.redirect(`/restaurants/${comment.restaurantId}`)
    })
  })
})

// 3. Export router
module.exports = router