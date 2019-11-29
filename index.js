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

//console.log(scales.list());

// I
const ionian = scales.list().filter(x => !!~x.indexOf('ionian'));
// II
const dorian = scales.list().filter(x => !!~x.indexOf('dorian'));
// iii
const phrygian = scales.list().filter(x => !!~x.indexOf('phrygian'));
// IV
const lydian = scales.list().filter(x => !!~x.indexOf('lydian'));
// V
const mixolydian = scales.list().filter(x => !!~x.indexOf('mixolydian'));
// vi
const aeolian = scales.list().filter(x => !!~x.indexOf('aeolian'));
// VII
const locrian = scales.list().filter(x => !!~x.indexOf('locrian'));

const pentatonic = scales.list().filter(x => !!~x.indexOf('pentatonic'));
const melodic = scales.list().filter(x => !!~x.indexOf('melodic'));
const harmonic = scales.list().filter(x => !!~x.indexOf('harmonic'));

const ian = scales.list().filter(x => !!~x.indexOf('ian'));


//const list = ian;
//const list = shuffle(scales.list().reverse()).reverse();
//const list = scales.list();
//const list = ['a_sharp_phrygian', 'g_sharp_locrian', 'g_minor_pentatonic'];
//const list = ['g_minor_pentatonic', 'g_phrygian'];

const list = ['c_major'];

const keys = new MidiKeyboard({ port: 0});

// keys.exit();
// process.exit();

let song = [];
function sampleOne(name, callback){
	console.log({ name });
	const programChange = {
		type: 'programChange',
		programNumber: 38 //45
	};
	const notes = scales.getMidiSorted(name).chords.triads;
	const rest = {
		message: 'pausing',
		type: "noteOff",
		noteNumber: 0,
		deltaTime: 1000
	};

	const progression = (scale, progress) => {
		const out = progress.reduce((all, one) => {
			all = [...all, ...scale[one]];
			return all;
		}, []);
		//console.log(out);
		return out;
	};

	//console.log({ notes });
	const theseNotes = [
		programChange,
		//...progression(notes, [1,5,6,4, 1,5,6,4]),
		...progression(notes, [1,4,2,5, 7,1,4,5 ]),
		//rest
	];
	//song = [...song, ...theseNotes];
	//callback();
	keys.play(theseNotes, callback);
}

async.eachSeries([...list, ...list, ...list, ...list, ...list, ...list], sampleOne, () => {
	// keys.play(song, () => {
	// 	keys.exit();
	// 	process.exit();
	// });
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
