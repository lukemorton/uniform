class Blog extends Uniform
  posts: if localStorage.posts then JSON.parse(localStorage.posts) else []

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
        
        newPost =
          title: @title.val()
          content: @content.val()

        @blog.header.after(Hogan.TemplateCache.post.render(newPost))
        @blog.posts.push(newPost)
        localStorage.posts = JSON.stringify(@blog.posts)

        [@title, @content].forEach (el) -> el.val('')
        @title.focus()

  template: ->
    Hogan.TemplateCache.form.render @
    
jQuery -> new Blog