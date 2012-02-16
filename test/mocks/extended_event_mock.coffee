@ExtendedEventMock = class extends @EventMock

  @extendEvents
    '':
      anotherEvent: (el, e) ->
        @eventsTriggered.push('anotherEvent')
