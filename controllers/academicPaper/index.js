const {
    academicPaperQueries
} = require('../../models/queries/index')
const constant = require('../../helper/constant')

module.exports = {

    async academicPapers(req, res) {
        let language = req.query.language || constant.LANGUAGE.ENGLISH
        let paperType = req.query.paperType || constant.PAPER_TYPE.PREVIOUS
        let examId = req.query.examId
        let paperList

        try {

            if (examId) paperList = await academicPaperQueries.getAcademicPaperByExamId(examId, language, paperType)
            else paperList = await academicPaperQueries.getAllPaperByPaperType(language, paperType)

            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: paperList
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


}