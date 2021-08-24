// Imports
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

// Middleware
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : ' ')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => Math.floor(Math.random() * 1000)

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    const person = persons.find(p => p.id === id)

    person
        ? res.json(person)
        // Resource not found
        : res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    if (persons.find(p => p.id === id)) {
        persons = persons.filter(p => p.id !== id)

        res.status(204).end()
    }
    else
        res.status(404).end()
})

app.post('/api/persons', (req, res) => {
  const {name, number} = req.body

  const alreadyExists = persons.find(p => p.name === name)

  if (!name || !number)
    return res.status(400).json({error: 'Content missing'})
  else if (alreadyExists)
    return res.status(400).json({error: 'Person already exists'})

  const newPerson = {
    id: generateId(),
    name,
    number
  }

  persons = [...persons, newPerson]

  return res.status(201).json(newPerson)
})

// app.patch('/api/persons/:id', (req, res) => {
//   const property = req.body

//   if (!property) {
//     return res.status(400).json({error: 'Content missing'})
//   }
// })

app.get('/info', (req, res) => {
    console.log(req)
    res.send(`<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`)
})


// 404: No endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})