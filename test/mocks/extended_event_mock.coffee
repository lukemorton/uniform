@ExtendedEventMock = class extends @EventMock

  events: ->
    events = super
    events[''].another_event = (el, e) ->
      @events_triggered.push('another_event')
    return events
