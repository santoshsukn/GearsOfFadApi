const express = require('express');
const expressObj = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const myRoutes = express.Router();
const authjwt = require('jsonwebtoken');
const msgToMobile = require('node-sms-send')
const Nexmo = require('nexmo');
let nodemailer = require('nodemailer');

let userTable = require('./user.module');
const Yup = require('yup');
let registerTable = require('./registeruser.module');
let patientData = require('./patients.module');
const PORT = 4000;
let otpGenerator = require('otp-generator')
 
let otp = otpGenerator.generate(6, { upperCase: false, specialChars: false,digits:true,alphabets:false });
console.log(otp);


expressObj.use(cors());
// expressObj.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
//  });
expressObj.use(bodyParser.json());


mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("We have successfully connected with database");
});

//Nexmo message send
const nexmo = new Nexmo({
  apiKey: '0f3c5e23',
  apiSecret: 'rvCtue8EFyDzcVnu',
});

const from = 'Nexmo';
const to = '+918888888888';
const text = 'Hello Friend Just Found you!!!';

nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
        console.log(err);
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Message sent successfully.");
        } else {
            console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
        }
    }
})

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'santosh@gmail.com',
        pass: 'gghgf@vvbvb'
    }
});

const Secretkey = "loginUser@Data";
myRoutes.route('/').get(function(req, res) {
    patientData.find(function(err, datas) {
        if (err) {
            console.log(err);
        } else {
            res.json(datas);
        }
    });
});

myRoutes.route('/userData').get(function(req, res) {
    console.log('number1');
    registerTable.find(function(err, datas) {
        if (err) {
            console.log(err);
        } else {
            res.json(datas);
        }
    });
});

myRoutes.route('/:id').get(function(req, res) {
    let id = req.url;
    let val = id.split('/');
    patientData.findById(val[1], function(err, datas) {
        res.json(datas);
    });
});


myRoutes.route('/delete/:id').post(function (req, res) {
    console.log("called  :-pp"+req.params.id)
    patientData.findByIdAndRemove({_id: req.params.id}, function(err, datas){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
}); 

myRoutes.route('/login').post(function(req, res) {
    let userLoginData = req.body;
    console.log(req.body)
    registerTable.find({userName : userLoginData.userName}, function(err, userlogData) {
        console.log(userlogData);
        if(Object.keys(userlogData).length>0 && userlogData[0].password == userLoginData.password){
            console.log("received data  "+userlogData[0]);
            //res.send(userlogData[0].role);
                authjwt.sign({userlogData},Secretkey,(err,token) => {
                    var obj = {};
                    obj.userlogData = userlogData;
                    obj.token = token;
                    if(err){
                        res.sendStatus(403);
                    } else {
                        res.send({
                            obj
                        })
                    }
                })
            
        } else res.json('login err');
    });
});  

myRoutes.route('/update/:id').post(function(req, res) {
    patientData.findById(req.params.id, function(err, datas) {
        if (!datas)
            res.status(404).send("Record is not found");
        else
        console.log(datas)
            datas.name = req.body.name;
            datas.email = req.body.email;

            datas.save().then(datas => {
                res.json('Record has been updated successfully!');
            })
            .catch(err => {
                res.status(400).send("Updatation of data  not possible");
            });
    });
});

myRoutes.route('/add').post(function(req, res) {
    let datas = new patientData(req.body);
    console.log(req.body)
    console.log(datas);
    datas.save()
        .then(datas => {
            res.status(200).json({'Patient': ' Patient added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new Patient failed');
        });
});

myRoutes.route('/register').post(function(req, res) {
    let datas = new registerTable(req.body);
    console.log(datas)
    let emailTo = datas.email
    // registerTable.find({userName : datas.userName}, function(err, results) {
    //     if(results){
        //     res.status(404).send("User name exist");
        // } else {
            datas.save()
            .then(datas => {
                // let mailOptions = {
                //     from: 'santosh@gmail.com',
                //     to: emailTo,
                //     subject: 'Test Email',
                //     text: 'Hi '+datas.fname+',/n You have successfully registered with Us. Your User name: '+datas.userName+ " password :" + datas.password
                // };

                // transporter.sendMail(mailOptions, function(error, info){
                //     if (error) {
                //         console.log(error);
                //     } else {
                //         console.log('Email sent: ' + info.response);
                //     }
                // });
            res.status(200).json({'User': ' User Registered successfully'});
        })
        .catch(err => { 
            res.status(400).send('adding new user failed');
        });

    // });
    
});

expressObj.use('/mydatabase', myRoutes);

expressObj.listen(PORT, function() {
    console.log("Your Server is running on Port: " + PORT);
});
