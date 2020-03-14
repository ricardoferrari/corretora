'use strict';
var express = require('express');
var router = express.Router();

const QuotationController = require('../controllers/QuotationController');


/* POST price listing. */
router.post('/', QuotationController.price);

module.exports = router;
