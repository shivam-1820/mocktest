const {
    subjectChapterAssociationModel,
    chapterModel,
} = require('../../index')
const { 
    Op 
} = require('sequelize');
const constant = require('../../../helper/constant')

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
        }).then(async (chapterIds) => {
            chapterIds = JSON.parse(JSON.stringify(chapterIds))

            return await chapterModel.findAll({
                attributes: chapterAttribute,
                where: {
                    chapterId: {
                        [Op.in]: (() => chapterIds.map(chapter => chapter.chapterId))()
                    },
                    chapterStatus: true
                }
            })

        })
    }
}