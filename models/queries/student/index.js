const {
    studentModel,
    studentKycModel,
    studentAssessmentRecordModel,
    studentEnrollmentModel
} = require("../..")
const constant = require("../../../helper/constant")

module.exports = {

    async getStudentByEmail(email) {
        return await studentModel.findOne({
            where: {
                email: email,
                isActive: true
            }
        })

    },

    async newStudent(data, transaction) {
        return await studentModel.create(data,
            {
                transaction
            })
    },

    async saveStudent(data, studentId, transaction) {
        return await studentModel.update(data,
            {
                where: {
                    studentId: studentId
                }
            }, {
            transaction
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

    async updateStudentKyc(data, studentId, transaction) {
        return await studentKycModel.update(data, {
            where: {
                studentId: studentId
            }
        }, {
            transaction
        })
    },

    async createStudentKyc(data) {
        return await studentKycModel.create(data, {
            transaction
        })
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

    async saveStudentAssessmentRecord(data, transaction) {
        return await studentAssessmentRecordModel.create(data, {
            transaction
        })
    },

    async enrollmentInfoByStudentId(studentId) {
        return await studentEnrollmentModel.findOne({
            where: {
                studentId: studentId,
                status: true
            }
        })
    },

    async saveEnrollmentData(data, transaction) {
        return await studentEnrollmentModel.create(data, {
            transaction
        })
    }
}