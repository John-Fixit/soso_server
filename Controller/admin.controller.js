const {
  awardModel,
  admissionModel,
  principalModel,
  galleryModel,
  adminModel,
} = require("../Model/admin.model");
const jwt = require('jsonwebtoken')
const cloudinary = require("cloudinary");
require("dotenv").config();
const SECRET = process.env.JWT_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const test = (req, res) => {
  res.send(`Hello world`);
};
const getAward = (req, res) => {
  awardModel.find((err, awards) => {
    if (err) {
      res.send({
        message: `Connection problem, please check your connection!`,
        status: false,
      });
    } else {
      res.send({ awards, status: true });
    }
  });
};
const postAward = (req, res) => {
  const form = new awardModel(req.body);
  form.save((err) => {
    if (err) {
      res.send({
        message: `Connection error, please check your connection!`,
        status: false,
      });
    } else {
      res.send({ message: `Award event saved successfully`, status: true });
    }
  });
};
const editAward = (req, res) => {
  const Id = req.body.awardId;
  const awardText = req.body.awardNote;
  awardModel.findOneAndUpdate(
    { _id: Id },
    { awardText: awardText },
    (err, result) => {
      if (err) {
        res.send({
          message: `Connection error! Editing unsuccessfull`,
          status: false,
        });
      } else {
        res.send({ message: `Award Edited successfully`, status: true });
      }
    }
  );
};
const deleteAward = (req, res) => {
  const Id = req.body.awardId;
  awardModel.deleteOne({ _id: Id }, (err, result) => {
    if (err) {
      res.send({
        message: `Network error! Award not yet deleted! please check your connection and try again`,
        status: false,
      });
    } else {
      res.send({ message: `award Deleted successfully`, status: true });
    }
  });
};
const admissionFunc = (req, res) => {
  const data = req.body;
  admissionModel.findOneAndUpdate(
    { _id: "6311c961150266ef2a5643d1" },
    {
      $set: {
        admissionReq: data.admissionReq,
        admissionEli: data.admissionEli,
        admissionPaymentInfo: data.admissionPaymentInfo,
        admissionRegStep: data.admissionRegStep,
        admissionBegins: data.admissionBegins,
        admissionCloses: data.admissionCloses,
      },
    },
    (err, result) => {
      if (err) {
        res.send({
          message: `Network error! please check your connection and try again`,
          status: false,
        });
      } else {
        res.send({ message: `Updating successfull`, result, status: true });
      }
    }
  );
};
const admissionReq = (req, res) => {
  admissionModel.find((err, result) => {
    if (err) {
      res.send({ message: `Network error!`, status: false });
    } else {
      res.send({ result, status: true, message: `Successfull result` });
    }
  });
};
const principalNote = (req, res) => {
  const imageLink = req.body.principalImage;

  cloudinary.v2.uploader.upload(imageLink, (err, result) => {
    if (err) {
      res.send({ message: `Error occurred, please check your connection!` });
    } else {
      const uploaded = result.secure_url;
      principalModel.findOneAndUpdate(
        { _id: "63167b70bac318afdd5f0b52" },
        {
          $set: {
            principalName: req.body.principalName,
            principalImage: uploaded,
            principalNote: req.body.principalNote,
          },
        },
        (err, result) => {
          if (err) {
            res.send({
              message: `Error occurred savings not successfull, please try again!`,
              status: false,
            });
          } else {
            res.send({ message: `Updating successfull`, status: true });
          }
        }
      );
    }
  });
};
const getprincipal = (req, res) => {
  principalModel.find((err, result) => {
    if (err) {
      res.send({ message: `Error ccurred`, status: false });
    } else {
      res.send({ result, status: true });
    }
  });
};
const galleryFunc = (req, res) => {
  console.log(req.body);
  const imgFile = req.body.file;
  cloudinary.v2.uploader.upload(imgFile, (err, resultURL) => {
    if (err) {
      res.json({
        message: `Something went wrong, image not uploaded successfully`,
        status: false,
      });
    } else {
      const newGallery = new galleryModel({
        title: req.body.galleryTitle,
        file: resultURL.secure_url,
      });
      newGallery.save((err) => {
        if (err) {
          res.json({
            message: `Something went wrong, please check your connection!`,
            status: false,
          });
        } else {
          res.json({
            message: `Uploaded successfully`,
            status: true,
          });
        }
      });
    }
  });
};
const getGallery=(req, res)=>{
    galleryModel.find((err, result)=>{
      if(err){
        res.json({
          message: `Something went wrong. please check your connection!`,
          status: false
        })
      }else{
        res.json({
          result,
          status: true
        })
      }
    })
}
const adminLogin =(req, res)=>{
  const username = req.body.username
  const password = req.body.password;
  adminModel.findOne({'username': username}, (err, user)=>{
    if(err){
      res.send({
        message: `Internal server error`,
        status: false
      })
    }else{
      if(!user){
        res.send({message: `This USERNAME is not registered/ not correct`, status: false})
      }else{
        user.validatePassword(password, (err, same)=>{
          if(err){
            res.json({message: `Internal server error, please check you connection`, status: false})
          }else{
            if(same){
                const token = jwt.sign({username}, SECRET, {expiresIn: '2h'})
                res.json({token, status: true})
            }else{
              res.json({message: `Password enterer is incorrect, please check an try again!`, status: false})
            }
          }
        })
      }
    }
  })
}
const adminHome=(req, res)=>{
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, SECRET, (err, result)=>{
      if(err){
        res.send({message: `Internal server error!`, status: false})
      }else{
          res.send({message: `User authorized`, status: true})
      }
    })
}

module.exports = {
  test,
  getAward,
  postAward,
  admissionFunc,
  admissionReq,
  editAward,
  deleteAward,
  principalNote,
  getprincipal,
  galleryFunc,
  getGallery,
  adminLogin,
  adminHome
};
