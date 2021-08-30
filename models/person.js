const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to: ', url)

mongoose.connect(url, 
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true 
  })
  .then(r => console.log('Connected to MongoDB'))
  .catch(e => console.error('Error connecting to MongoDB: ', e.message))


const personSchema = mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)