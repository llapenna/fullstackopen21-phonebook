const mongoose = require('mongoose')

// We make sure that the password is passed as an argument
if (process.argv.length < 3) {
  console.log('Password is missing: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url 
  = `mongodb+srv://losha:${password}@fullstackopen-phonebook.szz4z.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

// We retrieve all the persons in the database
if (process.argv.length === 3) {

  Person.find({}).then(r => {
    console.log('Phonebook: ')

    r.forEach(person => console.log(`${person.name} (${person.number})`))
    mongoose.connection.close()
  })
}
// We create a new entry
else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number
  })

  person.save()
    .then(result => {
      console.log(`Added ${name} (${number}) to phonebook.`)
      
      mongoose.connection.close()
    })
}