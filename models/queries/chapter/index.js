const {
    subjectChapterAssociationModel,
    chapterModel,
} = require('../../index')
const constant = require('../../../helper/constant')
const { Op } = require('sequelize');

module.exports = {

    async getChapterDetailBySubId(subjectId, language) {

        let chapterAttribute = ['chapterId']
        if (language == constant.LANGUAGE.ENGLISH) chapterAttribute.push(['nameEn', 'name'], ['descriptionEn', 'description'])
        else chapterAttribute.push(['nameHi', 'name'], ['descriptionHi', 'description'])
        return await subjectChapterAssociationModel.findAll({
            attributes: ['chapterId'],
            where: {
                subjectId: subjectId,
                associationStatus: true
            }
        }).then(async (subject) => {
            subject = JSON.parse(JSON.stringify(subject))

            return await chapterModel.findAll({
                attributes: chapterAttribute,
                where: {
                    chapterId: {
                        [Op.in]: (() => subject.map(chapter => chapter.chapterId))()
                    },
                    chapterStatus: true
                }
            })

        })
    }
}