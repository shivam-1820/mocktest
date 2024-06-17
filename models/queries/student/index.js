const {
    studentModel,
    studentKycModel,
    studentAssessmentRecordModel
} = require("../..")

module.exports = {

    async getStudentByEmail(email) {
        return await studentModel.findOne({
            where: {
                email: email,
                isActive: true
            }
        })

    },

    async newStudent(data) {
        return await studentModel.create(data)
    },

    async saveStudent(data, studentId) {
        return await studentModel.update(data,
            {
                where: {
                    studentId: studentId
                }
            }
        )
    },

    async studentById(studentId) {
        return await studentModel.findOne({
            where: {
                studentId: studentId,
                isActive: true
            }
        })
    },

    async getStudentKyc(studentId) {
        return await studentKycModel.findOne({
            where: {
                studentId: studentId
            }
        })
    },

    async updateStudentKyc(data, studentId) {
        return await studentKycModel.update(data, {
            where: {
                studentId: studentId
            }
        })
    },

    async createStudentKyc(data) {
        return await studentKycModel.create(data)
    },

    async updateNewPassword(newPassword, studentId) {
        return await studentModel.update({
            password: newPassword,
        },
            {
                where: {
                    studentId: studentId,
                    isActive: true
                }
            })
    },

    async saveStudentAssessmentRecord(data) {
        return await studentAssessmentRecordModel.create(data)
    }
}