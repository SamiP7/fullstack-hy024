import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleBlogTitleChange = (event) => {
    setNewBlog(prevState => ({ ...prevState, title: event.target.value }))
  }
  const handleBlogAuthorChange = (event) => {
    setNewBlog(prevState => ({ ...prevState, author: event.target.value }))
  }
  const handleBlogUrlChange = (event) => {
    setNewBlog(prevState => ({ ...prevState, url: event.target.value }))
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title:newBlog.title,
      author:newBlog.author,
      url:newBlog.url,
    })
    setNewBlog({ title: '', author: '', url: '' })
  }

  BlogForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>title:
          <input
            type='text'
            value={newBlog.title || ''}
            onChange={handleBlogTitleChange}/>
        </div>
        <div>author:
          <input
            type='text'
            value={newBlog.author || ''}
            onChange={handleBlogAuthorChange}/>
        </div>
        <div>url:
          <input
            type='text'
            value={newBlog.url || ''}
            onChange={handleBlogUrlChange}/>
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm