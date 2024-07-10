const Total = ({ parts }) => {
    const sum = parts.reduce((acc, curr) => acc + curr.exercises, 0)
    return (
      <>
        <strong>Number of exercises {sum}</strong>
      </>
    )
}

export default Total