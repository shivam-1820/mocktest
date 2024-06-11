const jwt = require('jsonwebtoken');

module.exports = {

    async generateAccessToken(userId, role) {
        return jwt.sign(
            {
                id: userId,
                role: role
            },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            {
                expiresIn: 60 * 60 * 24
            }
        )
    }
}