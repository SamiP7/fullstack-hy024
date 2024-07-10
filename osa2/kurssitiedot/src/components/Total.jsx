const Total = ({ parts }) => {
    let total = 0
    parts.forEach(value => {
       total = total + value.exercises
    })
    return (
      <>
        <p>Number of exercises {total}</p>
      </>
    )
}

export default Total