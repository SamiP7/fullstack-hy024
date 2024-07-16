const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('correct amount of blogs at initialization', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 6)
})

test('blogs identifier returned in correct form', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body.every(b => b.hasOwnProperty('id')))
})

test('blog can be added with api call', async () => {
    const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Different Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    }  
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const response = await api.get('/api/blogs')

    const author = response.body.map(r => r.author)
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(author.includes('Different Edsger W. Dijkstra'))

})

test('blog without title is not added', async() => {
    const newBlog = {
        author: 'Different Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog without url is not added', async() => {
    const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Different Edsger W. Dijkstra'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('new blogs default likes are 0 if no value given', async () => {
    const newBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Different Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    }

    await Blog.create(newBlog)
    const createdBlog = await Blog.findOne(newBlog)

    assert.strictEqual(createdBlog.likes, 0)
})

test('blog without author and likes is added', async() => {
    const newBlog = {
        title: 'Go To Statement Considered Harmful',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
})

test('deleting a blog succeeds if id is valid', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[1]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    assert(!blogsAtEnd.includes(blogToDelete))
})

test('deleting a blog fails if id is invalid', async() => {
    const blogToDelete = 'notvalidid'

    await api
        .delete(`/api/blogs/${blogToDelete}`)
        .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('updating likes of a blog if id is valid', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[1]
    const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 10
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
    
    const blogsAtEnd = await helper.blogsInDb()
    const resultedBlog = blogsAtEnd[1]
    
    assert.strictEqual(resultedBlog.likes, blogToUpdate.likes + 10)
})

test('updating likes of a blog if id is invalid', async() => {
    const blogToUpdate = 'notvalidid'
    const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 10
    }

    await api
        .put(`/api/blogs/${blogToUpdate}`)
        .send(updatedBlog)
        .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})