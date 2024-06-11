const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../utils/auth_middleware')
const constant = require('../../helper/constant')
const answerController = require('../../controllers/answer/index')




ROUTE.get('/verify-answer', authorize(constant.ROLES.STUDENT), answerController.isCorrectAnswer)









module.exports = ROUTE