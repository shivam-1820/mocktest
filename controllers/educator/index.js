const {
    educatorQueries
} = require('../../models/queries')
const {
    generateAccessToken
} = require('../../utils/jwt')
const mail = require('../../utils/mail')
const constant = require('../../helper/constant')
const bcrypt = require('bcrypt');



module.exports = {

    async signUp(req, res) {
        let fName = req.body.fName
        let lName = req.body.lName
        let email = req.body.email
        let password = req.body.password

        if (
            !fName ||
            !lName ||
            !email ||
            !password
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })
        if (password.length <= 3) return res.status(422)
            .send({
                code: 411,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.SHORT_PASSWORD
            })

        try {

            email = await mail.isEmailValid(email)
            if (!email) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INVALID_EMAIL
                })

            let data = {
                fName: fName,
                lName: lName,
                email: email,
                password: bcrypt.hashSync(password, 10),
            }

            let newEducator = await educatorQueries.newEducator(data)

            return res.status(200)
                .send({
                    code: 201,
                    status: constant.STATUS.SUCCESS,
                    data: newEducator,
                    msg: constant.SUCCESS_MESSAGES.NEW_PROFILE
                })
        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })

        }
    },

    async logIn(req, res) {
        let email = req.body.email
        let password = req.body.password

        if (!email || !password) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let educatorExists = await educatorQueries.educatorExists(email)
            if (!educatorExists) return res.status(422)
                .send({
                    code: 404,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.NOT_USER
                })

            /**To verify the password which is saved in database */
            let verifyPassword = await bcrypt.compare(password, educatorExists.password)
            if (!verifyPassword) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INCORRECT_PASSWORD
                })

            let accessToken = await generateAccessToken(educatorExists.educatorId, constant.ROLES.EDUCATOR);
            let lastLogin = await educatorQueries.saveEducatorDetails({ lastLogin: new Date() }, educatorExists.educatorId);

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    token: accessToken,
                    msg: constant.SUCCESS_MESSAGES.SUCCESSFUL_LOGIN
                })

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    },

    async updateNewPassword(req, res) {
        let educatorId = req.auth.id
        let oldPassword = req.body.oldPassword
        let newPassword = req.body.newPassword

        if (!oldPassword || !newPassword) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let educatorExists = await educatorQueries.educatorById(educatorId)
            if (!educatorExists) return res.status(422)
                .send({
                    code: 404,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.NOT_USER
                })

            let verifyPassword = await bcrypt.compare(oldPassword, educatorExists.password)
            if (!verifyPassword) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INCORRECT_PASSWORD
                })

            newPassword = bcrypt.hashSync(newPassword, 10)
            let updatenewPassword = await educatorQueries.updateNewPassword(newPassword, educatorId)

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    msg: constant.SUCCESS_MESSAGES.PASSWORD_UPDATE
                })

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    }


}


