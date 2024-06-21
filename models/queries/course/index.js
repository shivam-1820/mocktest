const {
    courseModel,
    courseExamAssociationModel,
    examModel
} = require('../../index')
const constant = require('../../../helper/constant')
const {
    Op
} = require('sequelize');

module.exports = {

    async getAllStream(language) {
        let attributes = ['courseId', 'image']
        if (language == constant.LANGUAGE.ENGLISH) attributes.push(['nameEn', 'name'], ['descriptionEn', 'description'])
        else attributes.push(['nameHi', 'name'], ['descriptionHi', 'description'])
        return await courseModel.findAll({
            attributes: attributes,
            where: {
                courseStatus: true
            }
        })
    },

    async examByStreamId(streamId, language) {
        let attributes = ['examId', 'image']
        if (language == constant.LANGUAGE.ENGLISH) attributes.push(['nameEn', 'name'], ['descriptionEn', 'description'])
        else attributes.push(['nameHi', 'name'], ['descriptionHi', 'description'])
        return await courseExamAssociationModel.findAll({
            where: {
                courseId: streamId,
                associationStatus: true
            }
        }).then(async res => {
            res = JSON.parse(JSON.stringify(res))
            let examDetails = await examModel.findAll({
                attributes: attributes,
                where: {
                    examId: {
                        [Op.in]: (() => res.map(exam => exam.examId))()
                    },
                    examStatus: true
                }
            })
            return examDetails

        })
    },

    async getAllExam(language) {
        let examAttributes = ['examId', 'image']
        if (language == constant.LANGUAGE.ENGLISH) examAttributes.push(['nameEn', 'name'], ['descriptionEn', 'description'])
        else examAttributes.push(['nameHi', 'name'], ['descriptionHi', 'description'])
        return await examModel.findAll({
            attributes: examAttributes,
            where: {
                examStatus: true
            }
        })
    }

}