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

after(async () => {
  await mongoose.connection.close()
})