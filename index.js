const async = require('async');

const ScalesPack = require('./models/ScalesPack');
const scales = new ScalesPack();

const MidiKeyboard = require('./models/MidiKeyboard');
const MidiChord = require('./models/MidiChord');
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
//const list = ['a_sharp_phrygian', 'g_sharp_locrian'];
//const list = ['g_minor_pentatonic', 'g_phrygian'];

//const list = ['d_major'];
const list = shuffle(
	scales.list().filter(x => !!~x.indexOf('a_sharp'))
).filter(x => !~x.indexOf('pentatonic'));

const keys = new MidiKeyboard({ port: 0});

// keys.exit();
// process.exit();
const rest = {
	message: 'pausing',
	type: "noteOff",
	noteNumber: 0,
	deltaTime: 100
};

const message = (msg) => ({
	message: msg,
	type: "noteOff",
	noteNumber: 0,
	deltaTime: 0
});

function sampleOne(name, callback){
	console.log({ name });
	const programChange = {
		type: 'programChange',
		programNumber: 38 //45
	};
	const chords = scales.getMidiSorted(name).chords.triads;


	const progression = (chords, progress) => {
		const out = progress.reduce((all, one) => {
			all = [...all, ...chords[one]];
			return all;
		}, []);
		//console.log(out);
		return out;
	};

	//console.log({ chords });
	const theseNotes = [
		programChange,
		//...progression(chords, [1,5,6,4, 1,5,6,4]),
		...progression(chords, [1,4,2,5, 7,1,4,5 ]),
		//rest
	];
	//song = [...song, ...thesechords];
	//callback();
	keys.play(theseNotes, callback);
}

function strumOne(name, callback){
	const triads = scales.getMidiSorted(name).chords.triads;

	let theseNotes = [];
	const strummify = (chord, number) => {
		const midiChord = new MidiChord({ series: chord, duration: 50  });
		const delay = 5;
		const hold = 100;
		theseNotes = [
			...theseNotes,
			message(`--- ${number}`),
			...midiChord.arp({ delay:0, hold: 100, direction: 'reverse' }),
			//...midiChord.arp({ delay:0, hold: 0 }),
			...midiChord.strum({ delay: 10, hold: 100 }),
			...midiChord.strum({ delay, hold, direction: 'reverse' }),
			//rest
		];
	}
	//[1,4,2,7, 1,4,7,3, 1,3,2,6, 1,6,4,5]
	[1,5,6,4]
	//[1,7,6,3, 1,5,3,6, 1,4,5,5]
		.forEach((number) => strummify(triads[number], number));

	keys.play(theseNotes, callback);
}

async.eachSeries([...list, ...list, ...list, ...list, ...list, ...list], strumOne, () => {
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
