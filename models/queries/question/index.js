const {
    questionAcademicPaperAssociationModel,
    questionModel,
    chapterQuestionAssociationModel
} = require('../../index')
const constant = require('../../../helper/constant')


module.exports = {

    async getAcademicQuestion(academicPaperId) {
        return await questionAcademicPaperAssociationModel.findAll({
            attributes: ['questionId', 'subjectId'],
            where: {
                academicPaperId: academicPaperId,
                associationStatus: true
            }
        })
    },

    async getChapterQuestion(chapterId) {
        return await chapterQuestionAssociationModel.findAll({
            attributes: ['questionId'],
            where: {
                chapterId: chapterId,
                associationStatus: true
            }
        })
    },

    async getQuestionDetailById(questionId, language) {
        let attributes = ['questionId', 'questionType', 'optionType', 'image']
        if (language == constant.LANGUAGE.ENGLISH) attributes.push(['textEn', 'text'])
        else attributes.push(['textHi', 'text'])
        return await questionModel.findOne({
            attributes: attributes,
            where: {
                questionId: questionId,
                questionStatus: true
            }
        })
    },

    async createNewQuestions(data, transaction) {
        return await questionModel.create({
            textEn: data.text,
            questionType: data.questionType,
            optionType: data.optionType,
            textHi: ''
        }, {
            transaction
        })
    }
}