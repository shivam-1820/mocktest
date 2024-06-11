const {
    studentQueries
} = require('../../models/queries')
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../utils/jwt')
const constant = require('../../helper/constant')
const mail = require('../../utils/mail')


module.exports = {

    async signUp(req, res) {
        let fName = req.body.fName
        let email = req.body.email
        let password = req.body.password
        let lName = req.body.lName

        if (!fName || !email || !password || !lName) return res.status(422)
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

            let newStudent = await studentQueries.newStudent(data)

            return res.status(200)
                .send({
                    code: 201,
                    status: constant.STATUS.SUCCESS,
                    data: newStudent,
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
            let lastLogin = await studentQueries.saveStudent({ lastLogin: new Date() }, studentExists.studentId);

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

    async saveStudentKyc(req, res) {
        let studentId = req.auth.id
        let avtar = req.body.avtar
        let dob = req.body.dob
        let gender = req.body.gender
        let number = req.body.number
        let qualification = req.body.qualification
        let degree = req.body.degree
        let secondaryMarks = req.body.secondaryMarks
        let higherSecondaryMarks = req.body.higherSecondaryMarks
        let studentKycData
        let msg

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

            let kycData = {
                studentId,
                avtar,
                dob,
                gender,
                number,
                qualification,
                degree,
                secondaryMarks,
                higherSecondaryMarks
            }

            let studentKycExists = await studentQueries.getStudentKyc(studentId)
            studentKycExists = JSON.parse(JSON.stringify(studentKycExists))

            if (studentKycExists) {
                let updateStudentKyc = await studentQueries.updateStudentKyc(kycData, studentId)
                msg = constant.SUCCESS_MESSAGES.PROFILE_UPDATED
            } else {
                let createStudentKyc = await studentQueries.createStudentKyc(kycData)
                studentKycData = createStudentKyc
                msg = constant.SUCCESS_MESSAGES.NEW_PROFILE
            }

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: studentKycData,
                    msg: msg
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

    async getMyProfile(req, res) {
        let studentId = req.auth.id

        try {

            let studentProfile = []
            let [
                studentDetails,
                studentKycDetails
            ] = await Promise.all([
                studentQueries.studentById(studentId),
                studentQueries.getStudentKyc(studentId)
            ])

            studentProfile.push(studentDetails)
            studentProfile.push(studentKycDetails)

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

        if (!oldPassword || !newPassword) return res.status(422)
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
    }
}
