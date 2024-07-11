import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')

  const hook = () => {
    axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  }

  useEffect(hook, [])

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFiltering = (event) => {
    const updatedValue = event.target.value
    setShowFiltered(updatedValue)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject ={
      name: newName,
      number: newNumber,
      hide: false,
    }
    
    if (!persons.some(i => i.name === personObject.name)) {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
      
    } else {
      alert(`${newName} is already added to phonebook`)
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        show={showFiltered}
        change={handleFiltering}
        />
      <h2>add a new</h2>
        <PersonForm
          addPerson={addPerson}
          name={newName} nameFunction={handlePersonChange}
          number={newNumber} numberFunction={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Number
        persons={persons}
        filter={showFiltered}
      />
    </div>
  )
}

const Number = ({persons, filter}) => {
  const personsToShow = persons.filter(person => person.name.includes(filter))
  return (
    <ul>
      {personsToShow.map(person =>
          <Person key={person.name}
            person={person}
          />
        )}
    </ul>
  )
}

const Person = ({person}) => {
  return (
    <div>
    {person.name} {person.number}
    </div>
  )
}

const Filter = ({show, change}) => {
  return (
    <div>
      filter shown with
      <input
      value={show}
      onChange={change}
      />
    </div>
  )
}

const PersonForm = ({addPerson, name, nameFunction, number, numberFunction}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
      name: 
      <input 
      value={name}
      onChange={nameFunction}
      />
      phonenumber:
      <input
      value={number}
      onChange={numberFunction}
      />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default App