const constant = require('../helper/constant')
const clientApi = require('./apiService')



module.exports = authorize;


function authorize(roles) {

    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [

        async (req, res, next) => {

            let token = req.headers.authorization
            let url = constant.LEARNERHUNT_API.AUTHORIZE_USER_ROUTE
            let headers = {
                authorization: token
            }

            if (!token)
                return res.status(401)
                    .send({
                        code: 401,
                        status: 'failed',
                        msg: 'Unauthorized'
                    })

            let apiRes = await clientApi.apiRequest('get', url, '', headers)

            if (apiRes.response)
                return res.status(422)
                    .send({
                        code: 422,
                        status: constant.STATUS.SUCCESS,
                        msg: apiRes.response.data
                    })

            if (apiRes.data && roles.length && !roles.includes(apiRes.data.data.role)) {
                return res.status(401)
                    .send({
                        code: 401,
                        status: 'failed',
                        msg: 'Unauthorized'
                    })
            }

            if ((roles.length && roles.includes(apiRes.data.data.role)) || roles == apiRes.data.data.role) {
                req.user = apiRes.data.data
                req.userType = apiRes.data.data.role == constant.ROLES.STUDENT ? 'student' : apiRes.data.data.role == constant.ROLES.EDUCATOR ? 'educator' : 'admin'
                next()
            } else {
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




// function authorize(roles = []) {

//     if (typeof roles === 'string') {
//         roles = [roles];
//     }
//     console.log('role', roles)

//     return [
//         // jwt({
//         //     secret: secretKey,
//         //     algorithms: ['HS256']
//         // }),

//         (req, res, next) => {
//             if (
//                 roles.length &&
//                 !roles.includes(req.auth.role
//                 )) {
//                 return res.status(401)
//                     .send({
//                         code: 401,
//                         status: 'failed',
//                         msg: 'Unauthorized'
//                     })
//             }
//             // switch (req.auth.role) {
//             //     case constant.ROLES.STUDENT:
//             //         studentQueries.studentById(req.auth.id)
//             //             .then(
//             //                 user => {
//             //                     if (user) {
//             //                         if (!user.isActive) return res.status(422)
//             //                             .send({
//             //                                 code: 403,
//             //                                 status: 'failed',
//             //                                 msg: 'Unactive account'
//             //                             })
//             //                         req.user = JSON.parse(JSON.stringify(user))
//             //                         req.userType = constant.ROLES.STUDENT
//             //                         next()
//             //                     } else {
//             //                         return res.status(404)
//             //                             .send({
//             //                                 code: 404,
//             //                                 status: 'failed',
//             //                                 msg: 'User not found'
//             //                             })
//             //                     }
//             //                 }
//             //             )
//             //         break
//             //     case constant.ROLES.EDUCATOR:
//             //         educatorQueries.educatorById(req.auth.id)
//             //             .then(
//             //                 user => {
//             //                     if (user) {
//             //                         if (!user.isActive) return res.status(422)
//             //                             .send({
//             //                                 code: 403,
//             //                                 status: 'failed',
//             //                                 msg: 'Unactive account'
//             //                             })
//             //                         req.user = JSON.parse(JSON.stringify(user))
//             //                         req.userType = constant.ROLES.EDUCATOR
//             //                         next()
//             //                     } else {
//             //                         return res.status(404)
//             //                             .send({
//             //                                 code: 404,
//             //                                 status: 'failed',
//             //                                 msg: 'User not found'
//             //                             })
//             //                     }
//             //                 }
//             //             )
//             //         break
//             //     case constant.ROLES.ADMIN:
//             //         adminQueries.adminById(req.auth.id)
//             //             .then(
//             //                 user => {
//             //                     if (user) {
//             //                         if (!user.isActive) return res.status(422)
//             //                             .send({
//             //                                 code: 403,
//             //                                 status: 'failed',
//             //                                 msg: 'Unactive account'
//             //                             })
//             //                         req.user = JSON.parse(JSON.stringify(user))
//             //                         req.userType = constant.ROLES.ADMIN
//             //                         next()
//             //                     } else {
//             //                         return res.status(404)
//             //                             .send({
//             //                                 code: 404,
//             //                                 status: 'failed',
//             //                                 msg: 'User not found'
//             //                             })
//             //                     }
//             //                 }
//             //             )
//             //         break
//             //     default:
//             //         return res.status(401)
//             //             .send({
//             //                 code: 401,
//             //                 status: 'failed',
//             //                 msg: 'Unauthorized'
//             //             })


//             // }
//             next()
//         }

//     ]
// }