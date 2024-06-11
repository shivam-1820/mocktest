const {
    answerQueries
} = require('../../models/queries/index')
const constant = require('../../helper/constant')

module.exports = {

    async isCorrectAnswer(req, res) {
        let language = req.query.language || constant.LANGUAGE.ENGLISH
        let questionId = req.query.questionId
        let optionId = req.query.optionId
        let msg

        if (!questionId || !optionId) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let getAnswerByQuesId = await answerQueries.answerBYQuestionId(questionId, language)
            getAnswerByQuesId = JSON.parse(JSON.stringify(getAnswerByQuesId))

            if (getAnswerByQuesId.answerId == optionId) msg = constant.SUCCESS_MESSAGES.CORRECT_ANSWER
            else msg = constant.ERROR_MESSAGES.INCORRECT_ANSWER


            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    msg: msg,
                    correctAnswer: getAnswerByQuesId
                })

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: 'failed',
                    msg: error.message
                })
        }

    }
}