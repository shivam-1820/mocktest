const {
    questionAcademicPaperAssociationModel,
    questionModel,
    chapterQuestionAssociationModel
} = require('../../index')
const constant = require('../../../helper/constant')
const { Op } = require('sequelize');


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
        return await questionModel.findAll({
            attributes: attributes,
            where: {
                questionId: questionId,
                questionStatus: true
            }
        })
    }
}