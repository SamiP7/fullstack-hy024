import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '+142 151 242 12', hide: false }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFiltering = (event) => {
    const updatedValue = event.target.value
    setShowFiltered(updatedValue)
    for (let i = 0; i < persons.length; i++) {
      if (!persons[i].name.includes(updatedValue)) {
          persons[i].hide = true
      } else {
        persons[i].hide = false
      }
    }
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
      />
    </div>
  )
}

const Number = ({persons}) => {
  const personsToShow = persons.filter(person => person.hide === false)
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