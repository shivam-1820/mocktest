const {
    academicPaperModel,
    examAcademicPaperAssociationModel,
    questionAcademicPaperAssociationModel
} = require('../../index')
const {
    Op
} = require('sequelize');
const constant = require('../../../helper/constant')

module.exports = {

    async getAllPaperByPaperType(language, paperType) {
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

    async examAcademicPaperRelation(examId, academicPaperId, transaction) {
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
        let attributes = ['academicPaperId', 'year', 'paperType', 'createdAt', 'isFree', 'price']
        if (language == constant.LANGUAGE.ENGLISH) attributes.push(['titleEn', 'title'], ['descriptionEn', 'description'])
        else attributes.push(['titleHi', 'title'], ['descriptionHi', 'description'])
        return await academicPaperModel.findAll({
            attributes: attributes,
            where: {
                createdById: Id,
                paperStatus: true
            }
        })
    },

    async getAcademicPaperByExamId(examId, language, paperType) {

        let accademicPaperAttributes = ['academicPaperId', 'year', 'createdBy', 'createdById', 'createdAt']
        if (language == constant.LANGUAGE.ENGLISH) accademicPaperAttributes.push(['titleEn', 'title'], ['descriptionEn', 'description'])
        else accademicPaperAttributes.push(['titleHi', 'title'], ['descriptionHi', 'description'])

        return await examAcademicPaperAssociationModel.findAll({
            attributes: ['academicPaperId'],
            where: {
                examId: examId,
                associationStatus: true
            }
        }).then(async res => {
            res = JSON.parse(JSON.stringify(res))
            return await academicPaperModel.findAll({
                attributes: accademicPaperAttributes,
                where: {
                    academicPaperId: {
                        [Op.in]: (() => res.map(paperId => paperId.academicPaperId))()
                    },
                    paperType: paperType,
                    paperStatus: true,
                    createdBy: constant.ROLES.ADMIN
                }
            })
        })
    }

}