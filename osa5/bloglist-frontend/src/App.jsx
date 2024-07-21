import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorBoolean, setErrorBoolean] = useState(false)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      blogService.setToken(user.token)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      setErrorBoolean(false)
      setNotificationMessage(`successfully logged in, welcome ${user.name}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch(exception) {
      setErrorBoolean(true)
      setNotificationMessage('wrong credentials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setBlogs([])
    setUser(null)
    window.localStorage.clear()
    setErrorBoolean(false)
    setNotificationMessage('logged out')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returnedBlog = await blogService.create(blogObject)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
      setErrorBoolean(false)
      setNotificationMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch(exception) {
      setErrorBoolean(true)
      setNotificationMessage(`${exception.response.data.error}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type='text'
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          id='username'
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
          id='password'
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const addLike = async (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    try {
      await blogService.update(id, changedBlog)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    } catch(exception) {
      setErrorBoolean(true)
      setNotificationMessage(`${exception}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    const blog = blogs.find(b => b.id === id)
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
      setErrorBoolean(false)
      setNotificationMessage(`Deleted ${blog.title} by ${blog.author}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch(exception) {
      setErrorBoolean(true)
      setNotificationMessage(`${exception}`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notificationMessage} error={errorBoolean}/>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }
  blogs.sort((b1, b2) => (b2.likes - b1.likes))
  return (
    <div>
      <Notification message={notificationMessage} error={errorBoolean}/>
      <h2>blogs</h2>
      <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>
      <br />
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes={addLike} remove={removeBlog} user={user}/>
      )}
    </div>
  )
}

const Notification = ({ message, error }) => {
  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }
  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  if (message === null) {
    return null
  }

  if (error) {
    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
  }

  return (
    <div style={successStyle}>
      {message}
    </div>
  )
}

export default App