const {
    studentQueries,
    optionQueries
} = require('../../models/queries')
const {
    dbConfig
} = require('../../models/index');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../utils/jwt')
const constant = require('../../helper/constant')
const mail = require('../../utils/mail')
const moment = require('moment')

module.exports = {

    async signUp(req, res) {
        const transaction = await dbConfig.transaction()
        let fName = req.body.fName
        let email = req.body.email
        let password = req.body.password
        let lName = req.body.lName

        if (
            !fName ||
            !email ||
            !password ||
            !lName
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
            if (!checkEmail) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INVALID_EMAIL
                })

            let studentExists = await studentQueries.getStudentByEmail(email)
            if (studentExists) return res.status(422)
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

            let newStudent = await studentQueries.newStudent(data, transaction)
            await transaction.commit()
            return res.status(200)
                .send({
                    code: 201,
                    status: constant.STATUS.SUCCESS,
                    data: newStudent,
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

            let studentExists = await studentQueries.getStudentByEmail(email)
            if (!studentExists) return res.status(422)
                .send({
                    code: 404,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.NOT_USER
                })

            /**To verify the password which is saved in database */
            let verifyPassword = await bcrypt.compare(password, studentExists.password)
            if (!verifyPassword) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INCORRECT_PASSWORD
                })

            let accessToken = await generateAccessToken(studentExists.studentId, constant.ROLES.STUDENT);
            let lastLogin = await studentQueries.saveStudent({ lastLogin: new Date() }, studentExists.studentId, transaction);
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

    async saveStudentKyc(req, res) {
        const transaction = await dbConfig.transaction()
        let studentId = req.auth.id
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
        let studentId = req.auth.id

        try {

            let [
                studentDetails,
                studentKycDetails
            ] = await Promise.all([
                studentQueries.studentById(studentId),
                studentQueries.getStudentKyc(studentId)
            ])

            studentDetails = JSON.parse(JSON.stringify(studentDetails))
            studentKycDetails = JSON.parse(JSON.stringify(studentKycDetails))

            let studentProfile = { ...studentDetails, ...studentKycDetails }

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: studentProfile
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
        let studentId = req.auth.id
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
        let studentId = req.auth.id
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

    async saveStudentEnrollment(req, res) {
        const transaction = await dbConfig.transaction()
        let studentId = req.auth.id
        let academicPaperId = req.body.academicPaperId
        let enrollmentType = req.body.enrollmentType
        let paid = req.body.paid
        let studentEnrollment

        if (
            !academicPaperId ||
            !enrollmentType
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let currentDate = moment().format('YYYY-MM-DD hh:mm:ss')

            let studentEnrollmentInfo = await studentQueries.enrollmentInfoByStudentId(studentId)
            studentEnrollmentInfo = JSON.parse(JSON.stringify(studentEnrollmentInfo))

            /** for trial test */
            if (enrollmentType == constant.ENROLLMENT_TYPE.TRIAL) {
                if (
                    studentEnrollmentInfo &&
                    studentEnrollmentInfo.isOption == true
                ) return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.FAILED,
                        msg: constant.ERROR_MESSAGES.DUBLICATE_TRIAL
                    })


                let trialData = {
                    studentId: studentId,
                    academicPaperId: academicPaperId,
                    type: constant.ENROLLMENT_TYPE.FREE,
                    isTrial: true,
                    expiryDate: moment(currentDate).add(7, 'days').format('YYYY-MM-DD hh:mm:ss'),
                }

                studentEnrollment = await studentQueries.saveEnrollmentData(trialData, transaction)

                /** for purchase test */
            } else if (enrollmentType == constant.ENROLLMENT_TYPE.PURCHASED) {
                if (
                    studentEnrollmentInfo &&
                    studentEnrollmentInfo.academicPaperId == academicPaperId &&
                    studentEnrollmentInfo.type == constant.ENROLLMENT_TYPE.PURCHASED
                ) return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.FAILED,
                        msg: constant.ERROR_MESSAGES.DUBLICATE_TEST
                    })

                let purchasedData = {
                    studentId: studentId,
                    academicPaperId: academicPaperId,
                    type: constant.ENROLLMENT_TYPE.PURCHASED,
                    paid: paid
                }

                studentEnrollment = await studentQueries.saveEnrollmentData(purchasedData, transaction)

                /** for free test */
            } else if (enrollmentType == constant.ENROLLMENT_TYPE.FREE) {
                if (
                    studentEnrollmentInfo &&
                    studentEnrollmentInfo.academicPaperId == academicPaperId &&
                    studentEnrollmentInfo.type == constant.ENROLLMENT_TYPE.FREE
                ) return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.FAILED,
                        msg: constant.ERROR_MESSAGES.DUBLICATE_TEST
                    })

                let freeData = {
                    studentId: studentId,
                    academicPaperId: academicPaperId,
                    type: constant.ENROLLMENT_TYPE.FREE,
                }

                studentEnrollment = await studentQueries.saveEnrollmentData(freeData, transaction)

            }

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
