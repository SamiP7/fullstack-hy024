const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
})

test('users are returned', async () => {
    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
})

test('user is created when fields are valid', async () => {
    const newUser = {
        username: 'sopiva',
        name: 'kuka',
        password: 'kelpaa',
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
})

test('user is not created when username already exists', async () => {
    const newUser = {
        username: 'mluukkai',
        name: 'taas',
        password: 'sopiva',
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
})

test('user is not created when password is not valid', async () => {
    const newUser = {
        username: 'sopiva',
        name: 'kuka',
        password: 'a',
    }

    await api.post('/api/users')
        .send(newUser)
        .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
})

after(async () => {
    await mongoose.connection.close()
})