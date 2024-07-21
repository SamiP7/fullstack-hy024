import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'Testit ovat kivoja',
  author: 'joku',
  url: 'jotain.com',
  user: {
    name: 'tyhja',
    username: 'onko',
  }
}


test('renders just title and author at the start', () => {
  const container = render(
    <Blog blog={blog} user={blog.user}
    />
).container
  const div = container.querySelector('.togglableContent')
  expect(div).toHaveStyle('display: none')
})

test('all content shown after clicking button', async () => {
  const container = render(
    <Blog blog={blog} user={blog.user}
    />
).container
  const user = userEvent.setup()
  const button = screen.getByText('view')

  await user.click(button)

  const div = container.querySelector('.togglableContent')
  expect(div).not.toHaveStyle('display: none')
})


test('returns two props if like pressed twice', async () => {
  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={blog.user} updateLikes={mockHandler} />
  )
  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})