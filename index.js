const clone = obj => JSON.parse(JSON.stringify(obj));

const MidiKeyboard = require('./models/MidiKeyboard');
const GameLoop = require('./models/GameLoop');

const random1 = require('./instruments/random1');
const hats = require('./instruments/hats');
const bassDrum = require('./instruments/bass_drum');

const keys = new MidiKeyboard();

const loop = new GameLoop({
	delay: 1000
});

const dummyId = loop.add(random1(keys));
const hatsId = loop.add(hats(keys));
const bassDrumId = loop.add(bassDrum(keys));
//console.log({ dummyId });

loop.start();
