const blog = require("../models/blog")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }

    return blogs.length === 0 
        ? 0
        : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let mostLikes = 0
    let place = 0
    const result = {
        title: "",
        author: "",
        likes: 0
    }

    for (let i = 0; i < blogs.length; i++) {
        if (blogs[i].likes > result.likes) {
            result.title = blogs[i].title
            result.author = blogs[i].author
            result.likes = blogs[i].likes
        }
    }

    return blogs.length === 0
        ? {}
        : result
}

//Molemmat varmaan mahdollista tehdä jotenkin hienosti reduce metodilla, mutta en ainakaan itse vielä ymmärrä sen käyttöä tarpeeksi hyvin
const mostBlogs = (blogs) => {
    const authorMap = new Map();
    blogs.forEach((a) => {
        if (authorMap.has(a.author)) {
            authorMap.set(a.author, { blogs: authorMap.get(a.author).blogs + 1})
        } else {
            authorMap.set(a.author, {blogs : 1})
        }
    })
    const result = {
        author: "",
        blogs: 0
    }

    let mostBlogs = 0
    authorMap.forEach((val, key) => {
        if (val.blogs > mostBlogs) {
            mostBlogs = val.blogs
            result.author = key
            result.blogs = val.blogs
        }
    })

    return blogs.length === 0
        ? {}
        : result
}

const mostLikes = (blogs) => {
    const authorMap = new Map();
    blogs.forEach((a) => {
        if (authorMap.has(a.author)) {
            authorMap.set(a.author, { likes: authorMap.get(a.author).likes + a.likes})
        } else {
            authorMap.set(a.author, {likes : a.likes})
        }
    })
    const result = {
        author: "",
        likes: 0
    }

    let mostLikes = 0

    authorMap.forEach((val, key) => {
        if (val.likes > mostLikes) {
            mostLikes = val.likes
            result.author = key
            result.likes = val.likes
        }
    })

    return blogs.length === 0
        ? {}
        : result
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}