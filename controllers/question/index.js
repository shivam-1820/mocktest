const {
    questionQueries,
    optionQueries,
    subjectQueries,
} = require('../../models/queries/index')
const constant = require('../../helper/constant')

module.exports = {

    async getQuestionsByAcademicId(req, res) {
        let academicPaperId = req.query.academicPaperId
        let language = req.query.language || constant.LANGUAGE.ENGLISH

        if (!academicPaperId) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let getAllQuestionIds = await questionQueries.getAcademicQuestion(academicPaperId, language)
            getAllQuestionIds = JSON.parse(JSON.stringify(getAllQuestionIds))

            let questionData = await Promise.all(getAllQuestionIds.map(async (data) => {
                let [
                    getQuestionDetails,
                    getOptionDetails,
                    getSubjectDetails
                ] = await Promise.all([
                    questionQueries.getQuestionDetailById(data.questionId, language),
                    optionQueries.getOptionDetailById(data.questionId, language),
                    subjectQueries.getSubjectDetailById(data.subjectId, language)
                ])

                return {
                    question: getQuestionDetails,
                    subject: getSubjectDetails,
                    options: getOptionDetails
                }

            }))

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: questionData
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

    async getQuestionsByChapterId(req, res) {
        let chapterId = req.query.chapterId
        let language = req.query.language || constant.LANGUAGE.ENGLISH

        if (!chapterId) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let getAllQuestionIds = await questionQueries.getChapterQuestion(chapterId)
            getAllQuestionIds = JSON.parse(JSON.stringify(getAllQuestionIds))

            let questionData = await Promise.all(getAllQuestionIds.map(async (data) => {
                let [
                    getQuestionDetails,
                    getOptionDetails
                ] = await Promise.all([
                    questionQueries.getQuestionDetailById(data.questionId, language),
                    optionQueries.getOptionDetailById(data.questionId, language)
                ])

                return {
                    question: getQuestionDetails,
                    options: getOptionDetails
                }

            }))

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: questionData
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