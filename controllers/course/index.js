const {
    courseQueries,
    subjectQueries,
    chapterQueries
} = require('../../models/queries/index')
const constant = require('../../helper/constant')

module.exports = {

    async allStream(req, res) {
        let language = req.query.language || constant.LANGUAGE.ENGLISH

        try {

            let getAllStream = await courseQueries.getAllStream(language)
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: getAllStream
                })

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    },

    async examsByStreamId(req, res) {
        let language = req.query.language || constant.LANGUAGE.ENGLISH
        let streamId = req.query.streamId
        let allStream = req.query.allStream
        let examCourses

        if (!streamId && !allStream) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            if (streamId) examCourses = await courseQueries.examByStreamId(streamId, language)
            else examCourses = await courseQueries.getAllExam(language)
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: examCourses
                })

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    },

    async subjectByExamId(req, res) {
        let language = req.query.language || constant.LANGUAGE.ENGLISH
        let examId = req.query.examId

        if (!examId) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let subjectDetail = await subjectQueries.getSubjectDetailByexamId(examId, language)
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: subjectDetail
                })

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    },

    async chapterBySubjectId(req, res) {
        let language = req.query.language || constant.LANGUAGE.ENGLISH
        let subjectId = req.query.subjectId

        if (!subjectId) return res.status(422)
            .send({
                code: 422,
                status: constant.STATUS.FAILED,
                msg: constant.ERROR_MESSAGES.REQUIRED_DATA
            })

        try {

            let chapterDetail = await chapterQueries.getChapterDetailBySubId(subjectId, language)
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: chapterDetail
                })

        } catch (error) {
            return res.status(422)
                .send({
                    code: 422,
                    status: constant.STATUS.FAILED,
                    msg: error.message
                })
        }
    }
}