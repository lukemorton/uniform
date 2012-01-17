class Blog extends Uniform
  posts: [
    {title: 'Second blog title', content: '<p>Another paragraph.</p>'}
    {title: 'A blog title', content: '<p>A paragraph.</p>'}
  ]

  elements:
    header: 'h1'

  template: ->
    Hogan.TemplateCache.blog.render @,
      post: Hogan.TemplateCache.post

  init: -> @el.prepend((new BlogForm(blog: @)).el).appendTo('body')

class BlogForm extends Uniform
  elements:
    title: '#title'
    content: '#content'

  events:
    '':
      submit: (e) ->
        e.preventDefault()
        @blog.header.after Hogan.TemplateCache.post.render
          title: @title.val()
          content: @content.val()
        [@title, @content].forEach (el) -> el.val('')

  template: ->
    Hogan.TemplateCache.form.render @
    
jQuery -> new Blog