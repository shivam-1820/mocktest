const {
    educatorQueries,
    academicPaperQueries
} = require('../../models/queries')
const {
    dbConfig
} = require('../../models/index');
const constant = require('../../helper/constant')
const bcrypt = require('bcrypt');
const clientApi = require('../../utils/apiService')

module.exports = {

    async signUp(req, res) {
        let email = req.body.email
        let password = req.body.password
        let name = req.body.name
        let mobile = req.body.mobile

        if (
            !name ||
            !email ||
            !password ||
            !mobile
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

            let bodyFormData = {
                email,
                password,
                name,
                mobile
            }
            let url = constant.LEARNERHUNT_API.FIRST_EDUCATOR_ROUTE + '/getOTP'
            let headers = {
                "Content-Type": "multipart/form-data"
            }

            let apiRes = await clientApi.apiRequest('post', url, bodyFormData, headers)

            if (apiRes.status && (apiRes.status >= 200 || apiRes.status <= 300)) {
                return res.status(200)
                    .send({
                        code: 200,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.data
                    })
            } else {
                return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.response.data
                    })
            }

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    },

    async verifyOtp(req, res) {
        let email = req.body.email
        let otp = req.body.otp

        if (
            !email ||
            !otp
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let bodyFormData = {
                email,
                otp
            }
            let url = constant.LEARNERHUNT_API.FIRST_EDUCATOR_ROUTE + '/signup'
            let headers = {
                "Content-Type": "multipart/form-data"
            }

            let apiRes = await clientApi.apiRequest('post', url, bodyFormData, headers)
            if (!apiRes) return res.status(500)
                .send({
                    code: 500,
                    status: constant.STATUS.SUCCESS,
                    msg: 'server error'
                })
            if (apiRes.status && (apiRes.status >= 200 || apiRes.status <= 300)) {
                return res.status(200)
                    .send({
                        code: 200,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.data
                    })
            } else {
                return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.response.data
                    })
            }

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    },

    async resendOtp(req, res) {
        let email = req.body.email

        if (
            !email
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let bodyFormData = {
                email
            }
            let url = constant.LEARNERHUNT_API.FIRST_EDUCATOR_ROUTE + '/loginwithotp'
            let headers = {
                "Content-Type": "multipart/form-data"
            }

            let apiRes = await clientApi.apiRequest('post', url, bodyFormData, headers)

            if (apiRes.status && (apiRes.status >= 200 || apiRes.status <= 300)) {
                return res.status(200)
                    .send({
                        code: 200,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.data
                    })
            } else {
                return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.response.data
                    })
            }

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    },

    async getMyProfile(req, res) {
        let token = req.headers.authorization

        try {
            let headers = {
                authorization: token,
            }
            let url = constant.LEARNERHUNT_API.SECOND_EDUCATOR_ROUTE + '/my-profile'

            let apiRes = await clientApi.apiRequest('get', url, '', headers)

            if (apiRes.status && (apiRes.status >= 200 || apiRes.status <= 300)) {
                return res.status(200)
                    .send({
                        code: 200,
                        status: constant.STATUS.SUCCESS,
                        data: apiRes.data.data
                    })
            } else {
                return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.response.data
                    })
            }

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
        let otp = req.body.otp
        let bodyFormData

        if (
            !email ||
            (!otp && !password)
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            if (otp) bodyFormData = { email, otp }
            else bodyFormData = { email, password }
            let url = constant.LEARNERHUNT_API.FIRST_EDUCATOR_ROUTE + '/login'
            let headers = {
                "Content-Type": "multipart/form-data"
            }

            let apiRes = await clientApi.apiRequest('post', url, bodyFormData, headers)

            if (apiRes.status && (apiRes.status <= 200 || apiRes.status >= 300)) {
                return res.status(200)
                    .send({
                        code: 200,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.data
                    })
            } else {
                return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.response.data
                    })
            }

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
        let educatorId = req.user._id
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
        let educatorId = req.user._id
        let language = req.query.language || constant.LANGUAGE.ENGLISH

        try {
            let paperList = await academicPaperQueries.getTestSeriesByUserId(educatorId, language)
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
        let educatorId = req.user._id
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


