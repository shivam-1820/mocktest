const { expressjwt: jwt } = require('express-jwt');
const secretKey = process.env.ACCESS_TOKEN_SECRET_KEY;
const constant = require('../helper/constant')
const {
    studentQueries,
    educatorQueries
} = require('../models/queries/index')


module.exports = authorize;


function authorize(roles = []) {

    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        jwt({ secret: secretKey, algorithms: ['HS256'] }),

        (req, res, next) => {
            if (roles.length && !roles.includes(req.auth.role)) {
                return res.status(401)
                    .send({
                        code: 401,
                        status: 'failed',
                        msg: 'Unauthorized'
                    })
            }
            switch (req.auth.role) {
                case constant.ROLES.STUDENT:
                    studentQueries.studentById(req.auth.id)
                        .then(
                            user => {
                                if (user) {
                                    if (!user.isActive) return res.status(422)
                                        .send({
                                            code: 403,
                                            status: 'failed',
                                            msg: 'Unactive account'
                                        })
                                    req.user = JSON.parse(JSON.stringify(user))
                                    req.userType = constant.ROLES.STUDENT
                                    next()
                                } else {
                                    return res.status(404)
                                        .send({
                                            code: 404,
                                            status: 'failed',
                                            msg: 'User not found'
                                        })
                                }
                            }
                        )
                    break

                case constant.ROLES.EDUCATOR:
                    educatorQueries.educatorById(req.auth.id)
                        .then(
                            user => {
                                if (user) {
                                    if (!user.isActive) return res.status(422)
                                        .send({
                                            code: 403,
                                            status: 'failed',
                                            msg: 'Unactive account'
                                        })
                                    req.user = JSON.parse(JSON.stringify(user))
                                    req.userType = constant.ROLES.EDUCATOR
                                    next()
                                } else {
                                    return res.status(404)
                                        .send({
                                            code: 404,
                                            status: 'failed',
                                            msg: 'User not found'
                                        })
                                }
                            }
                        )
                    break

                default:
                    return res.status(401)
                        .send({
                            code: 401,
                            status: 'failed',
                            msg: 'Unauthorized'
                        })


            }

        }

    ]
}