const {
    academicPaperModel,
    examAcademicPaperAssociationModel,
    questionAcademicPaperAssociationModel
} = require('../../index')
const constant = require('../../../helper/constant')

module.exports = {

    async getPreviousYearPaper(language, paperType) {
        let attributes = ['academicPaperId', 'year', 'createdBy', 'createdById', 'createdAt']
        if (language == constant.LANGUAGE.ENGLISH) attributes.push(['titleEn', 'title'], ['descriptionEn', 'description'])
        else attributes.push(['titleHi', 'title'], ['descriptionHi', 'description'])
        return await academicPaperModel.findAll({
            attributes: attributes,
            where: {
                paperType: paperType,
                paperStatus: true,
                createdBy: constant.ROLES.ADMIN
            }
        })
    },

    async createNewTestSeries(data, transaction) {
        return await academicPaperModel.create(
            data,
            {
                transaction
            })
    },

    async examAcademicRelation(examId, academicPaperId, transaction) {
        return await examAcademicPaperAssociationModel.create({
            examId: examId,
            academicPaperId: academicPaperId

        }, {
            transaction
        })
    },

    async testSeriesQuestionRelation(questionId, academicPaperId, subjectId, transaction) {
        return await questionAcademicPaperAssociationModel.create({
            questionId: questionId,
            academicPaperId: academicPaperId,
            subjectId: subjectId
        }, {
            transaction
        })
    },

    async getTestSeriesById(Id, language) {
        let attributes = ['academicPaperId', 'year', 'paperType', 'createdAt']
        if (language == constant.LANGUAGE.ENGLISH) attributes.push(['titleEn', 'title'], ['descriptionEn', 'description'])
        else attributes.push(['titleHi', 'title'], ['descriptionHi', 'description'])
        return await academicPaperModel.findAll({
            attributes: attributes,
            where: {
                createdById: Id,
                paperStatus: true
            }
        })
    }

}