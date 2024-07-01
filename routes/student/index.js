const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../utils/auth_middleware')
const constant = require('../../helper/constant')
const studentController = require('../../controllers/student/index')

ROUTE.post(
    '/sign-up',
    studentController.signUp
)
ROUTE.post(
    '/log-in',
    studentController.logIn
)
ROUTE.post(
    '/kyc',
    authorize(constant.ROLES.STUDENT),
    studentController.saveStudentKyc
)
ROUTE.post(
    '/save-assessment-record',
    authorize(constant.ROLES.STUDENT),
    studentController.saveStudentAssessmentRecord
)
ROUTE.post(
    '/save-enrollment',
    authorize(constant.ROLES.STUDENT),
    studentController.saveStudentEnrollment
)

ROUTE.get(
    '/my-profile',
    authorize(constant.ROLES.STUDENT),
    studentController.getMyProfile
)

ROUTE.put(
    '/update-password',
    authorize(constant.ROLES.STUDENT),
    studentController.updateNewPassword
)







module.exports = ROUTE