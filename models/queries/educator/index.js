const {
    educatorModel,
    educatorKycModel
} = require('../..')

module.exports = {

    async newEducator(data, transaction) {
        return await educatorModel.create(data, {
            transaction
        })
    },

    async educatorExists(email) {
        return await educatorModel.findOne({
            where: {
                email: email,
                isActive: true
            }
        })
    },

    async saveEducatorDetails(data, educatorId, transaction) {
        return await educatorModel.update(data, {
            where: {
                educatorId: educatorId,
                isActive: true
            }
        }, {
            transaction
        })
    },

    async educatorById(educatorId) {
        return await educatorModel.findOne({
            where: {
                educatorId: educatorId,
                isActive: true
            }
        })
    },

    async updateNewPassword(newPassword, educatorId) {
        return await educatorModel.update({
            password: newPassword
        },
            {
                where: {
                    educatorId: educatorId,
                    isActive: true
                }
            }
        )
    },

    async getEducatorKyc(educatorId) {
        return await educatorKycModel.findOne({
            where: {
                educatorId: educatorId
            }
        })
    },

    async updateEducatorKyc(data, educatorId) {
        return await educatorKycModel.update(data, {
            where: {
                educatorId: educatorId
            }
        })
    },

    async createEducatorKyc(data, transaction) {
        return await educatorKycModel.create(data, {
            transaction
        })
    },

    async allEducator() {
        return await educatorModel.findAll({
            attributes: ['educatorId', 'fName', 'lName', 'email'],
            where: {
                isActive: true,
                isAdmin: false
            }
        })
    }
}