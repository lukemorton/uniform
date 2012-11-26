@EventMock = class extends Uniform
  events: ->
    '':
      an_event: (el, e) ->
        @events_triggered.push('an_event')

  init: ->
    super
    @events_triggered = []
