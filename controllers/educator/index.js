const {
    educatorQueries,
    questionQueries,
    optionQueries,
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
            if (
                !email
            ) return res.status(422)
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

    async addNewAcademicTest(req, res) {
        // let educatorId = '3f175905-bcbf-41e5-9b94-cc8b93608ffa'
        // let title = 'testing'
        // let questionDetails = [
        //     {
        //         "question": {
        //             "questionType": "text",
        //             "optionType": "multiple_choice",
        //             "image": null,
        //             "text": "<h3>The maximum vertical height to which a man can throw a ball is 136m. The maximum horizontal\ndistance upto which he can throw the same ball is : \n</h3>"
        //         }
        //         ,
        //         "subjectId": "2320d114-1cff-4d1e-acde-6fc7407caf98",
        //         "options": [
        //             {
        //                 "type": "text",
        //                 "image": null,
        //                 "text": "<p>136 m</p>",
        //                 "isCorrect": "1"
        //             },
        //             {
        //                 "type": "text",
        //                 "image": null,
        //                 "text": "<p>272 m</p>",
        //                 "isCorrect": "0"
        //             },
        //             {
        //                 "type": "text",
        //                 "image": null,
        //                 "text": "<p>192 m</p>",
        //                 "isCorrect": "0"
        //             },
        //             {
        //                 "type": "text",
        //                 "image": null,
        //                 "text": "<p>68 m</p>",
        //                 "isCorrect": "0"
        //             }
        //         ]
        //     },
        //     {
        //         "question": {
        //             "questionType": "both",
        //             "optionType": "multiple_choice",
        //             "image": "C:\\Users\\ashad\\OneDrive\\Pictures\\Screenshots\\Screenshot 2024-05-30 153644.png",
        //             "text": "<h3>As per given figure, a weightless pulley P is attached on a double inclined frictional surfaces. The tension in the string (massless) will be (if g = 10 m/s<sup>2</sup>)</h3>"
        //         }
        //         ,
        //         "subjectId": "2320d114-1cff-4d1e-acde-6fc7407caf98",
        //         "options": [
        //             {
        //                 "type": "text",
        //                 "image": null,
        //                 "text": "<p>4(√3+1)N</p>",
        //                 "isCorrect": "1"
        //             },
        //             {
        //                 "type": "text",
        //                 "image": null,
        //                 "text": "<p>(4√3+1)N</p>",
        //                 "isCorrect": "0"
        //             },
        //             {
        //                 "type": "text",
        //                 "image": null,
        //                 "text": "<p>(4√3-1)N</p>",
        //                 "isCorrect": "0"
        //             },
        //             {
        //                 "type": "text",
        //                 "image": null,
        //                 "text": "<p>4(√3-1)N</p>",
        //                 "isCorrect": "0"
        //             }
        //         ]
        //     },
        // ]

        const transaction = await dbConfig.transaction()
        let createdById = req.auth.id
        let title = req.body.title
        let examId = req.body.examId
        let questionDetails = req.body.questionDetails
        let paperType = req.body.paperType || constant.PAPER_TYPE.SAMPLE
        let year = req.body.year

        if (
            !title ||
            !questionDetails ||
            !examId ||
            (paperType && paperType == constant.PAPER_TYPE.PREVIOUS && !year)
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
                createdBy: req.auth.role || constant.ROLES.ADMIN,
            }

            let newTestSeries = await academicPaperQueries.createNewTestSeries(testSeriesData, transaction)
            newTestSeries = JSON.parse(JSON.stringify(newTestSeries))
            await academicPaperQueries.examAcademicRelation(examId, newTestSeries.academicPaperId)

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
    }


}


