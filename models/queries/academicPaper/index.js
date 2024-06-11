const {
    academicPaperModel
} = require('../../index')
const constant = require('../../../helper/constant')

module.exports = {

    async getPreviousYearPaper(language) {
        let attributes = ['academicPaperId', 'year', 'createdBy', 'createdById', 'createdAt']
        if (language == constant.LANGUAGE.ENGLISH) attributes.push(['titleEn', 'title'], ['descriptionEn', 'description'])
        else attributes.push(['titleHi', 'title'], ['descriptionHi', 'description'])
        return await academicPaperModel.findAll({
            attributes: attributes,
            where: {
                paperType: constant.PAPER_TYPE.PREVIOUS,
                paperStatus: true
            }
        })
    }

}