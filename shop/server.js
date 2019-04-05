require('./config/config');
require('./models/db');
var productRoute = require('./api/routes/product');
var orderRoute = require('./api/routes/order');
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
app.listen(process.env.PORT,()=>{
    console.log("server starts at port ",process.env.PORT);
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,PATCH,GET,DELETE,POST')
        return res.status(200).json({});
    }
    next();
});


app.use('/product',productRoute);
app.use('/order',orderRoute);



app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status=404;
    next(error);
});
app.use((error, req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:error.message
    });
});