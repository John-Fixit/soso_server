const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const awardSchema = new mongoose.Schema({
    awardText: String
})
const admissionSchema = new mongoose.Schema({
    admissionEli: String,
    admissionReq: String,
    admissionBegins: String,
    admissionCloses: String,
    admissionPaymentInfo: String,
    admissionRegStep: String
})
const principalSchema = new mongoose.Schema({
    principalName: String, 
    principalImage: String,
    principalNote: String
})
const gallery = new mongoose.Schema({
    title: String,
    file: String
})
const admin = new mongoose.Schema({
    username: String,
    password: String
})
let saltRound = 10;

admin.pre('save', function (next){
    bcrypt.hash(this.password, saltRound, (err, hashedPassword)=>{
        if(err){
            console.log(`There's an error`);
        }else{
            this.password = hashedPassword;
            next()
        }
    })
})

admin.methods.validatePassword= function(password, callback){
    bcrypt.compare(password, this.password, (err, same)=>{
        if(!err){
            callback(err, same)
        }else{
            next()
        }
    })
}
const awardModel = mongoose.model('SOSOAward_tb', awardSchema)
const admissionModel = mongoose.model('SOSOAdmission_tb', admissionSchema)
const principalModel = mongoose.model('Principal_tb', principalSchema)
const galleryModel = mongoose.model('Gallery_tb', gallery)
const adminModel = mongoose.model('Admin_tb', admin)
module.exports = {awardModel, admissionModel, principalModel, galleryModel, adminModel}