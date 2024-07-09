import { useState } from 'react'

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGoodByOne = () => setGood(good + 1)
  const increaseNeutralByOne = () => setNeutral(neutral + 1)
  const increaseBadByOne = () => setBad(bad + 1)

  return (
    <div>
      <Header 
        header='give feedback'
      />
      <Button 
        handleClick={increaseGoodByOne}
        text='good'
      />
      <Button 
        handleClick={increaseNeutralByOne}
        text='neutral'
      />
      <Button 
        handleClick={increaseBadByOne}
        text='bad'
      />
      <Header 
        header='statistics'
      />
      <Display
       text='good'
       stats={good}
      />
      <Display
       text='neutral'
       stats={neutral}
      />
      <Display
       text='bad'
       stats={bad}
      />
    </div>
  )
}

const Header = ({ header }) => {return (<h1>{header}</h1>)}

const Display = ({text, stats}) => {
  return (
    <div>{text} {stats}</div>

  )
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

export default App