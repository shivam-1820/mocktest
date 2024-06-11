const { optionModel, questionOptionAssociationModel } = require('../../index')
const { Op } = require('sequelize');
const constant = require('../../../helper/constant')

module.exports = {

    async getOptionDetailById(questionIds, language) {
        let optionAttributes = ['optionId', 'type', 'image']
        if (language == constant.LANGUAGE.ENGLISH) optionAttributes.push(['textEn', 'text'])
        else optionAttributes.push(['textHi', 'text'])
        return await questionOptionAssociationModel.findAll({
            attributes: ['optionId'],
            where: {
                questionId: questionIds,
                associationStatus: true
            }
        })
            .then(async (optionAssociation) => {
                optionAssociation = JSON.parse(JSON.stringify(optionAssociation))
                return await optionModel.findAll({
                    attributes: optionAttributes,
                    where: {
                        optionId: {
                            [Op.in]: (() => optionAssociation.map(option => option.optionId))()
                        },
                        optionStatus: true
                    }
                })
            })
    }
}