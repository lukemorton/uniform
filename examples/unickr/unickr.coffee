class App extends Uniform
	el: $('#unickr')

	elements:
		url    : '#url'
		gallery: '#gallery'

	events:
		form:
			submit: (e) ->
				e.preventDefault()
				@nickUrl(@url.val()).el.appendTo(@gallery)

	neverNicked: true

	nickUrl: (url) ->
		if @neverNicked
			@gallery.html('')
			@neverNicked = false
		new Asset(url: url)

class Asset extends Uniform
	url: null

	template: """
		<div class="asset">
			<img />
		</div>
	"""

	elements:
		img: 'img'

	init: -> @img.attr('src', @url)

jQuery -> new App

				