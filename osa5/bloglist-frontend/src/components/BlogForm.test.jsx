import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const inputTitle = container.querySelector('#blog-title')
  const inputAuthor = container.querySelector('#blog-author')
  const inputUrl = container.querySelector('#blog-url')
  const sendButton = screen.getByText('create')

  await user.type(inputTitle, 'Title')
  await user.type(inputAuthor, 'Author')
  await user.type(inputUrl, 'Url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(JSON.stringify(createBlog.mock.calls[0][0])).toBe(JSON.stringify({ title: 'Title', author: 'Author', url: 'Url' }))
})