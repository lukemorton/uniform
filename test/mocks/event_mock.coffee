@EventMock = class extends Uniform
  events: ->
    '':
      anEvent: (el, e) ->
        @eventsTriggered.push('anEvent')

  set_defaults: ->
    super
    @eventsTriggered = []