@EventMock = class extends Uniform
  events:
    '':
      anEvent: (el, e) ->
        @eventsTriggered.push('anEvent')

  constructor: ->
    super
    @eventsTriggered = []