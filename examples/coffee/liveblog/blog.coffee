# A Uniform example utilising hogan (mustache) and localStorage
# Written by Luke Morton
# https://github.com/DrPheltRight/uniform
class Blog extends Uniform
  # Get posts from localStorage if found
  posts: if localStorage.posts then JSON.parse(localStorage.posts) else []

  # Cache header
  elements: ->
    header: 'h1'

  # Render main template also with post partial
  template: (built) ->
    built(Hogan.TemplateCache.blog.render(@, post: Hogan.TemplateCache.post))

  # On init add BlogForm to @el then add @el to body
  init: ->
    super
    form = new BlogForm(@)
    @el.prepend(form.el).appendTo('body')

class BlogForm extends Uniform
  constructor: (@blog) -> super()

  elements: ->
    title: '#title'
    content: '#content'

  # On submit we want to add the new blog post
  events: ->
    '':
      submit: (el, e) ->
        e.preventDefault()
        
        newPost =
          title: @title.val()
          content: @content.val()

        # Render blog post
        @blog.header.after(Hogan.TemplateCache.post.render(newPost))

        # Store blog post in localStorage
        @blog.posts.push(newPost)
        localStorage.posts = JSON.stringify(@blog.posts)

        # Reset form
        [@title, @content].forEach (el) -> el.val('')
        @title.focus()

  # Use another hogan template for form
  template: (built) ->
    built(Hogan.TemplateCache.form.render(@))

# On load init
jQuery -> new Blog
