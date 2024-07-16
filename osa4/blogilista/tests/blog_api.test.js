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

after(async () => {
  await mongoose.connection.close()
})