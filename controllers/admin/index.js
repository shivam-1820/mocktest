const {
    dbConfig
} = require('../../models/index');
const {
    questionQueries,
    optionQueries,
    academicPaperQueries,
    educatorQueries,
    adminQueries
} = require('../../models/queries')
const {
    generateAccessToken
} = require('../../utils/jwt')
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

            let adminExists = await adminQueries.adminExists(email)
            if (adminExists) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.DUBLICATE_USER
                })

            let adminData = {
                fName: fName,
                lName: lName,
                email: email,
                password: bcrypt.hashSync(password, 10),
                isAdmin: true
            }

            let newAdmin = await educatorQueries.newEducator(adminData, transaction)
            await transaction.commit()
            return res.status(200)
                .send({
                    code: 201,
                    status: constant.STATUS.SUCCESS,
                    data: newAdmin,
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

            let adminExists = await adminQueries.adminExists(email)
            if (
                !adminExists
            ) return res.status(422)
                .send({
                    code: 404,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.NOT_USER
                })

            let verifyPassword = await bcrypt.compare(password, adminExists.password)
            if (
                !verifyPassword
            ) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INCORRECT_PASSWORD
                })

            let accessToken = await generateAccessToken(adminExists.educatorId, constant.ROLES.ADMIN);
            let lastLogin = await adminQueries.saveAdminDetails({ lastLogin: new Date() }, adminExists.educatorId, transaction);
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

    async addNewAcademicTest(req, res) {
        const transaction = await dbConfig.transaction()
        let createdById = req.user._id
        let title = req.body.title
        let examId = req.body.examId
        let questionDetails = req.body.questionDetails
        let paperType = req.body.paperType || constant.PAPER_TYPE.SAMPLE
        let year = req.body.year
        let isFree = req.body.isFree
        let price = req.body.price
        let duration = req.body.duration

        if (
            !title ||
            !questionDetails ||
            !examId ||
            (paperType && paperType == constant.PAPER_TYPE.PREVIOUS && !year) ||
            (isFree == constant.STATUS.FALSE && !price)
        ) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let testSeriesData = {
                titleEn: title,
                createdById: createdById,
                paperType: paperType,
                year: year,
                createdBy: req.userType,
                isFree: isFree,
                price: price,
                duration: duration
            }

            let newTestSeries = await academicPaperQueries.createNewTestSeries(testSeriesData, transaction)
            newTestSeries = JSON.parse(JSON.stringify(newTestSeries))
            await academicPaperQueries.examAcademicPaperRelation(examId, newTestSeries.academicPaperId)

            let testSeriesQuestions = await Promise.all(questionDetails.map(async (data) => {

                let questionData = await questionQueries.createNewQuestions(data.question, transaction)
                questionData = JSON.parse(JSON.stringify(questionData))
                await academicPaperQueries.testSeriesQuestionRelation(questionData.questionId, newTestSeries.academicPaperId, data.subjectId, transaction)

                if (data.question.optionType == constant.OPTION_TYPE.MULTIPLE_CHOICE) {
                    await Promise.all(data.options.map(async ele => {

                        let optionData = await optionQueries.createNewOptions(ele.text, ele.image, ele.type, ele.isCorrect, transaction)
                        optionData = JSON.parse(JSON.stringify(optionData))

                        await optionQueries.questionOptionRelation(questionData.questionId, optionData.optionId, ele.isCorrect, transaction)
                    }))
                } else if (data.question.optionType == constant.OPTION_TYPE.TRUE_OR_FALSE) {
                    let isCorrect
                    let getTFQIds = await optionQueries.getTFQIds()

                    await Promise.all(getTFQIds.map(async ele => {
                        if (ele.textEn == data.tfqAnswer.toString()) isCorrect = 1
                        else isCorrect = 0

                        await optionQueries.questionOptionRelation(questionData.questionId, ele.optionId, isCorrect, transaction)

                    }))
                }
            }))
            await transaction.commit()
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    msg: constant.SUCCESS_MESSAGES.SAVE_DATA,
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