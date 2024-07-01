const express = require('express');
const ROUTE = express.Router();
const studentRoutes = require('./student/index')
const educatorRoutes = require('./educator/index')
const courseRoutes = require('./course/index')
const academicPaperRoutes = require('./academicPaper/index')
const questionRoutes = require('./question/index')
const answerRoutes = require('./answer/index')
const adminRoutes = require('./admin/index')




ROUTE.use('/student', studentRoutes)
ROUTE.use('/educator', educatorRoutes)
ROUTE.use('/course', courseRoutes)
ROUTE.use('/academic-paper', academicPaperRoutes)
ROUTE.use('/question', questionRoutes)
ROUTE.use('/answer', answerRoutes)
ROUTE.use('/admin', adminRoutes)






module.exports = ROUTE;