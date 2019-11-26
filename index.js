const async = require('async');

const ScalesPack = require('./models/ScalesPack');
const scales = new ScalesPack();

const MidiKeyboard = require('./models/MidiKeyboard');
const GameLoop = require('./models/GameLoop');

const { clone, range, shuffle } = require('./utilities');
/*
// instruments
const random1 = require('./instruments/random1');
const hats = require('./instruments/hats');
const bassDrum = require('./instruments/bass_drum');
*/

//const locrian = scales.list().filter(x => !!~x.indexOf('locrian'));
//const list = shuffle(scales.list().reverse()).reverse();
const list = ['a_sharp_phrygian', 'g_sharp_locrian'];

const keys = new MidiKeyboard({ port: 0});

function sampleOne(name, callback){
	console.log({ name });
	const programChange = {
		type: 'programChange',
		programNumber: 38 //45
	};
	const notes = scales.getMidiSorted(name).notes;
	keys.play([
		programChange,
		...notes,
		...notes
	], callback);
}

async.eachSeries([...list, ...list, ...list], sampleOne, () => {
	process.exit();
});



// const loop = new GameLoop({
// 	delay: 1000
// });

// const dummyId = loop.add(random1(keys));
//const hatsId = loop.add(hats(keys));
//const bassDrumId = loop.add(bassDrum(keys));
//console.log({ dummyId });

//loop.start();
