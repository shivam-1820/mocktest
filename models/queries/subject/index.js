const {
    subjectModel,
    subjectChapterAssociationModel,
    chapterModel,
    examSubjectAssociationModel
} = require('../../index')
const constant = require('../../../helper/constant')
const { Op } = require('sequelize');

module.exports = {

    async getSubjectDetailById(subjectId, language) {
        let attributes = []
        if (language == constant.LANGUAGE.ENGLISH) attributes.push(['nameEn', 'name'], ['descriptionEn', 'description'])
        else attributes.push(['nameHi', 'name'], ['descriptionHi', 'description'])

        return await subjectModel.findOne({
            attributes: attributes,
            where: {
                subjectId: subjectId,
                subjectStatus: true
            }
        })
    },

    async getSubjectDetailByexamId(examId, language) {

        let subjectAttributes = ['subjectId']
        if (language == constant.LANGUAGE.ENGLISH) subjectAttributes.push(['nameEn', 'name'], ['descriptionEn', 'description'])
        else subjectAttributes.push(['nameHi', 'name'], ['descriptionHi', 'description'])

        return await examSubjectAssociationModel.findAll({
            attributes: ['subjectId'],
            where: {
                examId: examId,
                associationStatus: true
            }
        }).then(async (subjectIds) => {
            subjectIds = JSON.parse(JSON.stringify(subjectIds))
            return await subjectModel.findAll({
                attributes: subjectAttributes,
                where: {
                    subjectId: {
                        [Op.in]: (() => subjectIds.map(subject => subject.subjectId))()
                    },
                    subjectStatus: true
                }
            })
        })

    }

}