const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../utils/auth_middleware')
const constant = require('../../helper/constant')
const academicPaperController = require('../../controllers/academicPaper/index')

ROUTE.get('/previous-year-papers', authorize(constant.ROLES.STUDENT), academicPaperController.previousYearPapers)





module.exports = ROUTE