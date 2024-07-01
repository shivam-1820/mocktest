const {
    educatorModel
} = require('../..')

module.exports = {

    async adminExists(email) {
        return await educatorModel.findOne({
            where: {
                email: email,
                isActive: true,
                isAdmin: true
            }
        })
    },

    async saveAdminDetails(data, educatorId, transaction) {
        return await educatorModel.update(data, {
            where: {
                educatorId: educatorId,
                isActive: true,
                isAdmin: true
            }
        }, {
            transaction
        })
    },

    async adminById(adminId) {
        return await educatorModel.findOne({
            where: {
                educatorId: adminId,
                isActive: true,
                isAdmin: true
            }
        })
    }
}