const {
    educatorQueries,
    academicPaperQueries
} = require('../../models/queries')
const {
    generateAccessToken
} = require('../../utils/jwt')
const {
    dbConfig
} = require('../../models/index');
const mail = require('../../utils/mail')
const constant = require('../../helper/constant')
const bcrypt = require('bcrypt');

module.exports = {

    async signUp(req, res) {
        const transaction = await dbConfig.transaction()
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

            let checkEmail = await mail.isEmailValid(email)
            if (
                !checkEmail
            ) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INVALID_EMAIL
                })

            let educatorExists = await educatorQueries.educatorExists(email)
            if (educatorExists) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.DUBLICATE_USER
                })

            let data = {
                fName: fName,
                lName: lName,
                email: email,
                password: bcrypt.hashSync(password, 10),
            }

            let newEducator = await educatorQueries.newEducator(data, transaction)
            await transaction.commit()
            return res.status(200)
                .send({
                    code: 201,
                    status: constant.STATUS.SUCCESS,
                    data: newEducator,
                    msg: constant.SUCCESS_MESSAGES.NEW_PROFILE
                })

        } catch (error) {
            await transaction.rollback()
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })

        }
    },

    async logIn(req, res) {
        const transaction = await dbConfig.transaction()
        let email = req.body.email
        let password = req.body.password

        if (
            !email ||
            !password
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let educatorExists = await educatorQueries.educatorExists(email)
            if (
                !educatorExists
            ) return res.status(422)
                .send({
                    code: 404,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.NOT_USER
                })

            /**To verify the password which is saved in database */
            let verifyPassword = await bcrypt.compare(password, educatorExists.password)
            if (
                !verifyPassword
            ) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INCORRECT_PASSWORD
                })

            let accessToken = await generateAccessToken(educatorExists.educatorId, constant.ROLES.EDUCATOR);
            let lastLogin = await educatorQueries.saveEducatorDetails({ lastLogin: new Date() }, educatorExists.educatorId, transaction);
            await transaction.commit()
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    token: accessToken,
                    msg: constant.SUCCESS_MESSAGES.SUCCESSFUL_LOGIN
                })

        } catch (error) {
            await transaction.rollback()
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

        if (
            !oldPassword ||
            !newPassword
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let educatorExists = await educatorQueries.educatorById(educatorId)
            if (
                !educatorExists
            ) return res.status(422)
                .send({
                    code: 404,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.NOT_USER
                })

            let verifyPassword = await bcrypt.compare(oldPassword, educatorExists.password)
            if (
                !verifyPassword
            ) return res.status(422)
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
    },

    async academicPaperByEducatorId(req, res) {
        let educatorId = req.auth.id
        let language = req.query.language || constant.LANGUAGE.ENGLISH

        try {
            let paperList = await academicPaperQueries.getTestSeriesById(educatorId, language)
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: paperList
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

    async saveEducatorKyc(req, res) {
        const transaction = await dbConfig.transaction()
        let educatorId = req.auth.id
        let avatar = req.body.avatar
        let dob = req.body.dob
        let gender = req.body.gender
        let number = req.body.number
        let qualification = req.body.qualification
        let degree = req.body.degree
        let specialization = req.body.specialization
        let msg
        let educatorKycData

        if (
            !dob ||
            !gender ||
            !qualification ||
            !degree
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let kycData = {
                educatorId,
                avatar,
                dob,
                gender,
                number,
                qualification,
                degree,
                specialization
            }

            let educatorKycExists = await educatorQueries.getEducatorKyc(educatorId)
            educatorKycExists = JSON.parse(JSON.stringify(educatorKycExists))

            if (educatorKycExists) {
                let updateEducatorKyc = await educatorQueries.updateEducatorKyc(kycData, educatorId)
                msg = constant.SUCCESS_MESSAGES.PROFILE_UPDATED
            } else {
                let createEducatorKyc = await educatorQueries.createEducatorKyc(kycData, transaction)
                educatorKycData = createEducatorKyc
                msg = constant.SUCCESS_MESSAGES.NEW_PROFILE

            }

            await transaction.commit()
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: educatorKycData,
                    msg: msg
                })

        } catch (error) {
            await transaction.rollback()
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    },

    async getMyProfile(req, res) {
        let educatorId = req.auth.id

        try {

            let [
                educatorDetails,
                educatorKycDetails
            ] = await Promise.all([
                educatorQueries.educatorById(educatorId),
                educatorQueries.getEducatorKyc(educatorId)
            ])

            educatorDetails = JSON.parse(JSON.stringify(educatorDetails))
            educatorKycDetails = JSON.parse(JSON.stringify(educatorKycDetails))

            let educatorProfile = { ...educatorDetails, ...educatorKycDetails }

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: educatorProfile
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

    async getAllEducator(req, res) {
        try {

            let educators = await educatorQueries.allEducator()
            let educatorData = await Promise.all(educators.map(async data => {
                data = JSON.parse(JSON.stringify(data))

                let educatorKyc = await educatorQueries.getEducatorKyc(data.educatorId)
                educatorKyc = JSON.parse(JSON.stringify(educatorKyc))

                return { ...data, ...educatorKyc }

            }))
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: educatorData
                })

        } catch (error) {
            console.log(error)
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    }


}


