@ExtendedEventMock = class extends @EventMock

  events: ->
    events = super
    events[''].anotherEvent = (el, e) ->
      @eventsTriggered.push('anotherEvent')
    return events
