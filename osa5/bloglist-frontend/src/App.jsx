import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: ''})
  const [username, setUsername] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorBoolean, setErrorBoolean] = useState(false)

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
    console.log(user)
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
      setNotificationMessage('wrong crenditials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    console.log('click')
    setBlogs([])
    setUser(null)
    window.localStorage.clear()
    setErrorBoolean(false)
      setNotificationMessage('logged out')
      setTimeout(() => {
        setNotificationMessage(null)
    }, 5000)
  }

  const handleBlogTitleChange = (event) => {
    setNewBlog(prevState => ({...prevState, title: event.target.value}))
  }
  const handleBlogAuthorChange = (event) => {
    setNewBlog(prevState => ({...prevState, author: event.target.value}))
  }
  const handleBlogUrlChange = (event) => {
    setNewBlog(prevState => ({...prevState, url: event.target.value}))
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title:newBlog.title,
      author:newBlog.author,
      url:newBlog.url,
    }
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setNewBlog({ title: '', author: '', url: ''})
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
        onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
        type="password"
        value={password}
        name='Password'
        onChange={({target}) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const blogForm = () => (
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
  )

  if (user === null) {
    return (
      <div>
      <Notification message={notificationMessage} error={errorBoolean}/>
        <h2>Log in to application</h2>
          {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <Notification message={notificationMessage} error={errorBoolean}/>
      <h2>blogs</h2>
      <div>{user.name} logged in <button onClick={handleLogout}>logout</button></div>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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