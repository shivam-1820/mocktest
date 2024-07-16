const {
    studentQueries,
    optionQueries
} = require('../../models/queries')
const {
    dbConfig
} = require('../../models/index');
const bcrypt = require('bcrypt');
const constant = require('../../helper/constant')
const moment = require('moment')
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
            let url = constant.LEARNERHUNT_API.FIRST_STUDENT_ROUTE + '/getOTP'
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
            let url = constant.LEARNERHUNT_API.FIRST_STUDENT_ROUTE + '/signup'
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
            console.log('error', error)
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
            let url = constant.LEARNERHUNT_API.FIRST_STUDENT_ROUTE + '/loginwithotp'
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
            let url = constant.LEARNERHUNT_API.FIRST_STUDENT_ROUTE + '/login'
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

    async saveStudentKyc(req, res) {
        const transaction = await dbConfig.transaction()
        let studentId = req.user_id
        let avatar = req.body.avatar
        let dob = req.body.dob
        let gender = req.body.gender
        let number = req.body.number
        let qualification = req.body.qualification
        let degree = req.body.degree
        let secondaryMarks = req.body.secondaryMarks
        let higherSecondaryMarks = req.body.higherSecondaryMarks

        if (
            !dob ||
            !gender ||
            !qualification ||
            !degree ||
            !secondaryMarks ||
            !higherSecondaryMarks
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let studentKycExists = await studentQueries.getStudentKyc(studentId)
            studentKycExists = JSON.parse(JSON.stringify(studentKycExists))

            if (studentKycExists) {
                let updateStudentKyc = await studentQueries.updateStudentKyc(kycData, studentId, transaction)
                return res.status(200)
                    .send({
                        code: 200,
                        status: constant.STATUS.SUCCESS,
                        msg: constant.SUCCESS_MESSAGES.PROFILE_UPDATED
                    })
            }

            let kycData = {
                studentId,
                avatar,
                dob,
                gender,
                number,
                qualification,
                degree,
                secondaryMarks,
                higherSecondaryMarks
            }

            let studentKyc = await studentQueries.createStudentKyc(kycData, transaction)
            await transaction.commit()
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: studentKyc,
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

    async getMyProfile(req, res) {
        let token = req.headers.authorization

        try {
            let headers = {
                authorization: token
            }
            let url = constant.LEARNERHUNT_API.SECOND_STUDENT_ROUTE + '/my-profile'

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

    async updateNewPassword(req, res) {
        let studentId = req.user_id
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

            let studentExists = await studentQueries.studentById(studentId)
            if (!studentExists) return res.status(422)
                .send({
                    code: 404,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.NOT_USER
                })

            let verifyPassword = await bcrypt.compare(oldPassword, studentExists.password)
            if (!verifyPassword) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INCORRECT_PASSWORD
                })

            newPassword = bcrypt.hashSync(newPassword, 10)
            let updatenewPassword = await studentQueries.updateNewPassword(newPassword, studentId)

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

    async saveStudentAssessmentRecord(req, res) {
        const transaction = await dbConfig.transaction()
        let studentId = req.user_id
        let courseId = req.body.courseId
        let academicPaperId = req.body.academicPaperId
        let subjectId = req.body.subjectId
        let chapterId = req.body.chapterId
        let questionId = req.body.questionId
        let selectedAnswerId = req.body.selectedAnswerId
        let answerMarkedAs

        if (
            !courseId ||
            !questionId ||
            !selectedAnswerId
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let isOption = await optionQueries.isOption(selectedAnswerId, questionId)
            if (!isOption) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INVALID_OPTION
                })

            let verifyOption = await optionQueries.verifyAnswerByOptionId(selectedAnswerId)
            if (verifyOption) answerMarkedAs = constant.ANSWERSTATUS.CORRECT
            else answerMarkedAs = constant.ANSWERSTATUS.WRONG


            let assessmentRecordData = {
                studentId,
                courseId,
                academicPaperId,
                subjectId,
                chapterId,
                questionId,
                selectedAnswerId,
                answerMarkedAs
            }

            let assessmentRecord = await studentQueries.saveStudentAssessmentRecord(assessmentRecordData, transaction)
            await transaction.commit()
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    msg: constant.SUCCESS_MESSAGES.SAVE_DATA,
                    data: assessmentRecord
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

    async studentTrial(req, res) {
        const transaction = await dbConfig.transaction()
        let studentId = req.user_id
        let examId = req.body.examId

        if (!examId) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let currentDate = moment().format('YYYY-MM-DD hh:mm:ss')

            let studentEnrollmentInfo = await studentQueries.trialInfoByStudentId(studentId)
            studentEnrollmentInfo = JSON.parse(JSON.stringify(studentEnrollmentInfo))

            if (
                studentEnrollmentInfo &&
                studentEnrollmentInfo.examId != examId
            ) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.DUBLICATE_TRIAL
                })

            if (
                studentEnrollmentInfo &&
                studentEnrollmentInfo.examId == examId &&
                !moment(currentDate).isBetween(studentEnrollmentInfo.purchaseDate, studentEnrollmentInfo.expiryDate)
            ) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.TRIAL_EXPIRED
                })

            if (
                studentEnrollmentInfo &&
                studentEnrollmentInfo.examId == examId
            ) return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    msg: constant.SUCCESS_MESSAGES.ALREADY_HAVE_TRIAL
                })

            let trialData = {
                studentId: studentId,
                examId: examId,
                type: constant.ENROLLMENT_TYPE.FREE,
                isTrial: true,
                expiryDate: moment(currentDate).add(7, 'days').format('YYYY-MM-DD hh:mm:ss'),
            }

            let studentEnrollment = await studentQueries.saveEnrollmentData(trialData, transaction)

            await transaction.commit()
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    msg: constant.SUCCESS_MESSAGES.SAVE_DATA,
                    data: studentEnrollment
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
    }
}
