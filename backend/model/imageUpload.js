const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({ 
  upload: {
    type: Buffer,
    required: true
  } 
})
 


module.exports = mongoose.model('User', uploadSchema)