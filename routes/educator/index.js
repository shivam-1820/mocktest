const express = require('express');
const ROUTE = express.Router();
const authorize = require('../../utils/auth_middleware')
const constant = require('../../helper/constant')
const educatorController = require('../../controllers/educator/index')



ROUTE.post('/sign-up', educatorController.signUp)
ROUTE.post('/log-in', educatorController.logIn)

ROUTE.put('/update-password', authorize(constant.ROLES.EDUCATOR), educatorController.updateNewPassword)






module.exports = ROUTE