const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../utils/auth_middleware')
const constant = require('../../helper/constant')
const educatorController = require('../../controllers/educator/index')

ROUTE.post(
    '/sign-up',
    educatorController.signUp
)
ROUTE.post(
    '/verify-otp',
    educatorController.verifyOtp
)
ROUTE.post(
    '/resend-otp',
    educatorController.resendOtp
)
ROUTE.post(
    '/log-in',
    educatorController.logIn
)
ROUTE.post(
    '/kyc',
    authorize(constant.ROLES.EDUCATOR),
    educatorController.saveEducatorKyc
)

ROUTE.get(
    '/educator-test-series',
    authorize(constant.ROLES.EDUCATOR),
    educatorController.academicPaperByEducatorId
)
ROUTE.get(
    '/my-profile',
    authorize(constant.ROLES.EDUCATOR),
    educatorController.getMyProfile
)
// ROUTE.get(
//     '/all-educator',
//     educatorController.getAllEducator
// )

// ROUTE.put(
//     '/update-password',
//     authorize(constant.ROLES.EDUCATOR),
//     educatorController.updateNewPassword
// )






module.exports = ROUTE