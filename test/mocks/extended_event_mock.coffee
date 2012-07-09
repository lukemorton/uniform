@ExtendedEventMock = class extends @EventMock

  @extend_events
    '':
      anotherEvent: (el, e) ->
        @eventsTriggered.push('anotherEvent')
