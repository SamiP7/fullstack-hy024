import { useState } from 'react'

const Blog = ({ blog, updateLikes, remove, user }) => {
  const [visible, setVisible] = useState(false)
  const [deletionVisible, setDeletionVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showDeletion = { display: deletionVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
    if (user.username === blog.user.username) {
      setDeletionVisible(true)
    } else {
      setDeletionVisible(false)
    }
  }

  const moreLikes = () => {
    updateLikes(blog.id)
  }

  const removeThisBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      remove(blog.id)
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className='blog'>
      <div style={{ ...blogStyle, ...hideWhenVisible }}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={{ ...blogStyle, ...showWhenVisible }} className='togglableContent'>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>hide</button><br />
        {blog.url}<br />
        likes {blog.likes}
        <button onClick={moreLikes}>like</button><br />
        {blog.user.name}<br />
        <button style={showDeletion} onClick={removeThisBlog}>remove</button>
      </div>
    </div>

  )}

export default Blog