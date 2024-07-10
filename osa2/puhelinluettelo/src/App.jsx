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

  const personsToShow = persons.filter(person => person.hide === false)

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
      <div>
      filter shown with
      <input
      value={showFiltered}
      onChange={handleFiltering}
      />
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: 
          <input 
          value={newName}
          onChange={handlePersonChange}
          />
        </div>
        <div>
          phonenumber:
          <input
          value={newNumber}
          onChange={handleNumberChange}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person =>
          <Person key={person.name}
            person={person}
          />
        )}
      </ul>
    </div>
  )

}

const Person = ({person}) => {
  return (
    <div>
    {person.name} {person.number}
    </div>
  )
}

export default App