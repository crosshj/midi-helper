const midi = require('midi');

// Set up a new output.
const output = new midi.Output();

// Count the available output ports.
const portcount = output.getPortCount();
console.log({ portcount });

const PORT = 0;

// Get the name of a specified output port.
const portName = output.getPortName(PORT);
console.log({ portName });

// Open the first available output port.
output.openPort(PORT);

// Send a MIDI message.
output.sendMessage([144,27,127]);

// Close the port when done.
output.closePort();
