'use strict'

const express = require('express');
const router = express.Router();

const {
    topics
} = require('../controllers/topics')

router.get('/javascript', (req, res) => {
    res.render('index', topics.js);
});

router.get('/react', (req, res) => {
    res.render('index', topics.react);
});

router.get('/node.js', (req, res) => {
    res.render('index', topics.nodejs);
});

router.get('/typescript', (req, res) => {
    res.render('index', topics.typescript);
})

module.exports = router;