@EventMock = class extends Uniform
  events: ->
    '':
      anEvent: (el, e) ->
        @eventsTriggered.push('anEvent')

  init: ->
    super
    @eventsTriggered = []