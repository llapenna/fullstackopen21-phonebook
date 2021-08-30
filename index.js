// Environment variables
require('dotenv').config()

// Imports
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// Models
const Person = require('./models/person')

const app = express()

// Middleware
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(e => next(e))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
    .then(p => {
      // We found an entry
      if(p) 
        res.json(p)
      else
        res.status(404).end()
    })
    .catch(e => next(e))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndRemove(id)
    .then(r => {
      const code = r ? 204 : 404

      res.status(code).end()
    })
    .catch(e => next(e))
})

app.post('/api/persons', (req, res, next) => {
  const {name, number} = req.body

  const person = new Person ({
    name,
    number
  })

  // Undefined body validated by error middleware
  person.save()
    .then(p => res.status(201).json(p))
    .catch(e => next(e))
})

 app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const {number} = req.body

  Person.findByIdAndUpdate(id, {number}, {new: true, runValidators: true})
    .then(p => res.status(201).json(p))
    .catch(e => next(e))
})



app.get('/info', (req, res, next) => {
    
  Person.find({})
  .then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`)
  })
  .catch(e => next(e))
})


// 404: No endpoint middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint.' })
}
app.use(unknownEndpoint)

// Error handler middleware
const errorHandler = (e, req, res, next) => {
  console.error(e.message)

  if (e.name === 'CastError') { 
    return res.status(400).send({ error: 'Malformatted id.' })
  }
  else if (e.name === 'ValidationError') {
    return res.status(400).send({ error: e.message })
  }
  else
  {
    console.log('Error name: ', e)
  }

  next(e)
}
app.use(errorHandler)


const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})