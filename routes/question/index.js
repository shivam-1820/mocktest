const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../utils/auth_middleware')
const constant = require('../../helper/constant')
const questionController = require('../../controllers/question/index')

ROUTE.get(
    '/academic-exam-questions', 
    authorize(constant.ROLES.STUDENT), 
    questionController.getQuestionsByAcademicId
)
ROUTE.get(
    '/chapter-questions', 
    authorize(constant.ROLES.STUDENT), 
    questionController.getQuestionsByChapterId
)








module.exports = ROUTE