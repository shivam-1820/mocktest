const { questionAnswerAssociationModel, answerModel } = require('../../index')
const constant = require('../../../helper/constant')

module.exports = {

    async answerBYQuestionId(questionId, language) {
        let answerAttributes = ['answerId']
        if (language == constant.LANGUAGE.ENGLISH) answerAttributes.push(['textEn', 'text'], ['descriptionEn', 'description'])
        else answerAttributes.push(['textHi', 'text'], ['descriptionHi', 'description'])

        return await questionAnswerAssociationModel.findOne({
            attributes: ['answerId'],
            where: {
                questionId: questionId,
                associationStatus: true
            }
        }).then(async (answer) => {
            return await answerModel.findOne({
                attributes: answerAttributes,
                where: {
                    answerId: answer.answerId,
                    answerStatus: true
                }
            })
        })
    }

}