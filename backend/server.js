const express = require("express");
const app = express();
const multer = require("multer");
const db = require("./db.js");
const mongoose = require("mongoose");
// upload Shema
const uploadSchema = require('./model/imageUpload.js');
const dotenv = require('dotenv');
dotenv.config();
// connection
mongoose.connect(
  db.url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, start) => {
    if (err) {
      console.log("err", err);
    } else {
      console.log("MongoDB database is started");
    }
  }
);
// Port
const port = process.env.PORT || 3001;
// multer
const upload = multer({ 
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(JPG|jpeg|png)$/)) {
      return cb(new Error("Image must be jpg, jpeg or png format!"));
    }
    cb(undefined, true);
  }
});

//Routes
app.post("/upload",  upload.single('upload'), async (req, res) => {
  const user = new uploadSchema() 
  user.upload = req.file.buffer  
    await user.save()
    console.log('USER', user)
    res.status(200).send(user._id);
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message });
  }
); 

app.get('/upload/:id', async (req, res)=>{
  console.log('REQ', req.params.id)
    try{
      const user =await uploadSchema.findById({_id: req.params.id})

      if(!user || !user.upload){
        throw new Error('MTF')
      }
      const data = { user:user.upload, msg: 'Yoou'  }
      res.set('Content-Type','image/jpg'); 
      res.send(data);
    } catch(err){
      console.log('err', err)
    }
})
app.get('/', (req, res)=>{
  const user = uploadSchema.find()
  console.log(uploadSchema.find())
})
// listener
app.listen(port, () => {
  console.log(`Server is up on ${port} port`);
});
