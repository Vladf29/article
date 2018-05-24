'use strict'

const express = require('express');
const router = express.Router();

const topicsController = require('../controllers/topics')

router.get('/javascript', topicsController.javaScript);

router.get('/react', topicsController.react);

router.get('/node.js', topicsController.nodejs);

router.get('/typescript', topicsController.typeScript);

module.exports = router;