require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet')
const constant = require('./helper/constant')


const models = require('./models/index');
const apiRoutes = require('./routes/index');


const port = process.env.port
const app = express();



app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
});



app.use('/api', apiRoutes);
app.use("*", (req, res, next) => {
    return res.status(404).send({ code: 404, status: constant.STATUS.FAILED, msg: constant.ERROR_MESSAGES.WRONG_URL });
});




models.dbConfig.sync({})
    .then(() => {
        console.log(constant.SUCCESS_MESSAGES.DATABASE_CONNECTED);
    })
    .catch(err => {
        console.log(constant.ERROR_MESSAGES.DATABASE_NOT_CONNECTED, err);
        process.exit();
    });



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});