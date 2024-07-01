const {
    optionModel,
    questionOptionAssociationModel
} = require('../../index')
const {
    Op
} = require('sequelize');
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
    },

    async createNewOptions(text, image, type, isCorrect, transaction) {
        return await optionModel.create({
            textEn: text,
            image: image,
            type: type,
            textHi: '',
            isCorrect: isCorrect
        }, {
            transaction
        }

        )
    },

    async isOption(optionId, questionId) {
        return await questionOptionAssociationModel.findOne({
            where: {
                questionId: questionId,
                optionId: optionId,
                associationStatus: true
            }
        })
    },

    async verifyAnswerByOptionId(optionId) {
        return await questionOptionAssociationModel.findOne({
            where: {
                optionId: optionId,
                associationStatus: true,
                isCorrect: true
            }
        })
    },

    async questionOptionRelation(questionId, optionId, isCorrect, transaction) {
        return await questionOptionAssociationModel.create({
            optionId: optionId,
            questionId: questionId,
            isCorrect: isCorrect
        }, {
            transaction
        }

        )
    },

    async getTFQIds() {
        return await optionModel.findAll({
            where: {
                textEn: {
                    [Op.or]: [constant.STATUS.TRUE, constant.STATUS.FALSE]
                }
            }
        })
    }
}