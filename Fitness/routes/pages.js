const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/activities', (req, res) => {
    res.render('activities')
})

router.get('/nutrition', (req, res) => {
    res.render('nutrition')
})

router.get('/goals', (req, res) => {
    res.render('goals')
})

router.get('/reports', (req, res) => {
    res.render('reports')
})

router.get('/progress', (req, res) => {
    res.render('progress')
})

router.get('/profile', (req, res) => {
    res.render('profile')
})

router.get('/settings', (req, res) => {
    res.render('settings')
})
module.exports = router