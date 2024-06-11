const {
    academicPaperQueries,
    answerQueries
} = require('../../models/queries/index')
const constant = require('../../helper/constant')


module.exports = {

    async previousYearPapers(req, res) {
        let language = req.query.language || constant.LANGUAGE.ENGLISH
        try {

            let paper = await academicPaperQueries.getPreviousYearPaper(language)
            return res.status(200)
                .send({
                    code: 200,
                    status: constant.STATUS.SUCCESS,
                    data: paper
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