const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../utils/auth_middleware')
const constant = require('../../helper/constant')
const adminController = require('../../controllers/admin/index')

ROUTE.post(
    '/sign-up',
    adminController.signUp
)
ROUTE.post(
    '/log-in',
    adminController.logIn
)
ROUTE.post(
    '/add-new-test-series',
    authorize([constant.ROLES.EDUCATOR, constant.ROLES.ADMIN]),
    adminController.addNewAcademicTest
)




module.exports = ROUTE