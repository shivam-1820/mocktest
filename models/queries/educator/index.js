const { educatorModel } = require('../..')
const educator = require('../../schemas/educator')
const { updateNewPassword } = require('../student')


module.exports = {

    async newEducator(data) {
        return await educatorModel.create(data)
    },

    async educatorExists(email) {
        return await educatorModel.findOne({
            where: {
                email: email,
                isActive: true
            }
        })
    },

    async saveEducatorDetails(data, educatorId) {
        return await educatorModel.update(data, {
            where: {
                educatorId: educatorId,
                isActive: true
            }
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
    }
}