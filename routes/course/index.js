const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../utils/auth_middleware')
const constant = require('../../helper/constant')
const courseController = require('../../controllers/course/index')

ROUTE.get(
    '/stream',
    authorize(constant.ROLES.STUDENT),
    courseController.allStream
)
ROUTE.get(
    '/exams',
    authorize([
        constant.ROLES.STUDENT,
        constant.ROLES.EDUCATOR
    ]),
    courseController.examsByStreamId
)
ROUTE.get(
    '/subject',
    authorize([
        constant.ROLES.STUDENT,
        constant.ROLES.EDUCATOR
    ]),
    courseController.subjectByExamId)
ROUTE.get(
    '/chapter',
    authorize(constant.ROLES.STUDENT),
    courseController.chapterBySubjectId
)





module.exports = ROUTE