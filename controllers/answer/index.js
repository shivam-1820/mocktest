const {
    optionQueries
} = require('../../models/queries/index')
const constant = require('../../helper/constant')

module.exports = {

    async isCorrectAnswer(req, res) {
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

            let isOption = await optionQueries.isOption(optionId, questionId)
            if (!isOption) return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: constant.ERROR_MESSAGES.INVALID_OPTION
                })
            let verifyOption = await optionQueries.verifyAnswerByOptionId(optionId)

            if (verifyOption) msg = constant.SUCCESS_MESSAGES.CORRECT_ANSWER
            else msg = constant.ERROR_MESSAGES.INCORRECT_ANSWER

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    msg: msg,
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