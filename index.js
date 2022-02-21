const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())


let persons = [
    {
        "name": "Arto Hellas",
        "number": "1",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "5",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendick",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "jii",
        "number": "1",
        "id": 5
    }
]

const generateAlmostRandomId = (max) => {
    return Math.floor(Math.random() * max)
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})


app.get('/api/info', (req, res) => {
    res.send(`<div>Phonebook has info for ${persons.length} people</div><br><div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const checkPostDataIsValid = (body) => {
    let checkIfNameExists = persons.some(person =>
        person.name === body.name)
    if(!body.name || !body.number || checkIfNameExists){
        return false
    }
    else{
        return true
    }
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(request.body)

    if (!checkPostDataIsValid(body)) {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    }
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateAlmostRandomId(10000),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})