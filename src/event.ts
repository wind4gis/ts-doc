import * as EventEmit from 'events'

const evnt = new EventEmit()
evnt.on('test', () => console.log(123))
evnt.on('test', () => console.log(234))
evnt.on('test', () => console.log(345))

evnt.emit('test')

evnt.emit("test");

evnt.on("test", function() {
  console.log("Event occured!"); // not logged into the console
});