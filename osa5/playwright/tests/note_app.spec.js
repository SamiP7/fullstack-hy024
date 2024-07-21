const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http:localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
          data: {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
          }
        })
    
        await page.goto('http://localhost:5173')
    })

    test('Log in form is shown', async ({ page }) => {
        const locator = await page.getByText('Log in to application', {expected: false})
        await expect(locator).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByTestId('username').fill('mluukkai')
            await page.getByTestId('password').fill('salainen')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByTestId('username').fill('mluukkai')
            await page.getByTestId('password').fill('wrong')

            await page.getByRole('button', { name: 'login' }).click()

            await expect(page.getByText('wrong credentials')).toBeVisible()
        })
    })

    describe('Different user', () => {
        beforeEach(async ({ page, request }) => {
            await request.post('http://localhost:3001/api/users', {
              data: {
                name: 'Matti Luukkainen2',
                username: 'mluukkai2',
                password: 'salainen'
              }
            })
        
            await page.goto('http://localhost:5173')

            await page.getByTestId('username').fill('mluukkai')
            await page.getByTestId('password').fill('salainen')

            await page.getByRole('button', { name: 'login' }).click()

            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByTestId('blog-title').fill('Tests are fun')
            await page.getByTestId('blog-author').fill('mluukkai')
            await page.getByTestId('blog-url').fill('full.com')

            await page.getByRole('button', { name: 'create' }).click()

            await page.getByRole('button', { name: 'logout' }).click()

            await page.getByTestId('username').fill('mluukkai2')
            await page.getByTestId('password').fill('salainen')

            await page.getByRole('button', { name: 'login' }).click()
        })

        test('user cant see delete button for a blog they havent created', async ({ page }) => {
            const blog = await page.locator('.blog')
            await expect(blog).toContainText('Tests are fun mluukkai')
            await page.getByRole('button', { name: 'view' }).click()
            await expect(page.getByRole('button', { name: 'remove' })).toBeHidden()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.getByTestId('username').fill('mluukkai')
            await page.getByTestId('password').fill('salainen')

            await page.getByRole('button', { name: 'login' }).click()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByTestId('blog-title').fill('Tests are fun')
            await page.getByTestId('blog-author').fill('mluukkai')
            await page.getByTestId('blog-url').fill('full.com')

            await page.getByRole('button', { name: 'create' }).click()

            await expect(page.getByText('Tests are fun by mluukkai added')).toBeVisible()
            const blog = await page.locator('.blog')
            await expect(blog).toContainText('Tests are fun mluukkai')
        })

        test('a newly created blog can be liked', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByTestId('blog-title').fill('Tests are fun')
            await page.getByTestId('blog-author').fill('mluukkai')
            await page.getByTestId('blog-url').fill('full.com')

            await page.getByRole('button', { name: 'create' }).click()
            const blog = await page.locator('.blog')
            await page.getByRole('button', { name: 'view' }).click()

            await expect(blog).toContainText('likes 0')
            
            await page.getByRole('button', { name: 'like' }).click()

            await expect(blog).toContainText('likes 1')
        })

        test('a newly created blog can be deleted', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click()

            await page.getByTestId('blog-title').fill('Tests are fun')
            await page.getByTestId('blog-author').fill('mluukkai')
            await page.getByTestId('blog-url').fill('full.com')

            await page.getByRole('button', { name: 'create' }).click()
            const blog = await page.locator('.blog')
            await page.getByRole('button', { name: 'view' }).click()
            
            await expect(blog).toHaveCount(1)
            page.on('dialog', dialog => dialog.accept())
            await page.getByRole('button', { name: 'remove' }).click()

            await expect(blog).toHaveCount(0)
        })

        describe('multiple blogs', () => {
            beforeEach(async ({ page }) => {
                await page.getByRole('button', { name: 'new blog' }).click()

                await page.getByTestId('blog-title').fill('Tests are fun')
                await page.getByTestId('blog-author').fill('mluukkai')
                await page.getByTestId('blog-url').fill('full.com')

                await page.getByRole('button', { name: 'create' }).click()

                const blog = await page.locator('.blog')

                await page.getByRole('button', { name: 'new blog' }).click()
                await page.getByTestId('blog-title').fill('Or are they')
                await page.getByTestId('blog-author').fill('mluukkai')
                await page.getByTestId('blog-url').fill('full.com')

                await page.getByRole('button', { name: 'create' }).click()

                await page.locator('.blog:has-text("Or are they")').waitFor()

                await page.getByRole('button', { name: 'new blog' }).click()
                await page.getByTestId('blog-title').fill('Maybe they are')
                await page.getByTestId('blog-author').fill('mluukkai')
                await page.getByTestId('blog-url').fill('full.com')

                await page.getByRole('button', { name: 'create' }).click()

                await page.locator('.blog:has-text("Maybe they are")').waitFor()
            })

            test('blogs are in order from most liked', async ({ page }) => {
                page.on('console', msg => console.log(msg.text()))
                const blogToLike = await page.locator('.blog:has-text("Or are they")')
                await blogToLike.getByRole('button', { name: 'view'}).click()
                await blogToLike.getByRole('button', { name: 'like'}).click()
                await page.locator('.blog:has-text("likes 1")').waitFor()

                await expect(page.locator('.blog').first()).toContainText('Or are they')
            })
        })
    })
})

