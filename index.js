const async = require('async');

const clone = obj => JSON.parse(JSON.stringify(obj));
const range = ({ start=0, end=0, length=0, source }) => source.filter(
	(a, i, arr) => {
		const arrayEndFilter = i <= (arr.length - end);
		const arrayStartFilter = i >= start;
		const arrayLengthFilter = length
			? i < length + start
			: true;
		//console.log({ i, arr: arr.length });
		//i <= 10 && console.log(arrayEndFilter, arrayStartFilter, arrayLengthFilter);
		return arrayEndFilter && arrayStartFilter && arrayLengthFilter;
	}
);

const ScalesPack = require('./models/ScalesPack');
const scales = new ScalesPack();

const MidiKeyboard = require('./models/MidiKeyboard');
const GameLoop = require('./models/GameLoop');

// instruments
const random1 = require('./instruments/random1');
const hats = require('./instruments/hats');
const bassDrum = require('./instruments/bass_drum');



// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

	  // Pick a remaining element...
	  randomIndex = Math.floor(Math.random() * currentIndex);
	  currentIndex -= 1;

	  // And swap it with the current element.
	  temporaryValue = array[currentIndex];
	  array[currentIndex] = array[randomIndex];
	  array[randomIndex] = temporaryValue;
	}

	return array;
  }
const locrian = scales.list().filter(x => !!~x.indexOf('locrian'));
//const list = shuffle(scalesList.reverse()).reverse();

const keys = new MidiKeyboard({ port: 0});


function sampleOne(name, callback){
	console.log({ name });
	const programChange = {
		type: 'programChange',
		programNumber: 62
	};
	const filtered = range({
		start: 1,
		//length: 11,
		source: scales.getMidi(name).tracks[0]
	});
	keys.play([programChange, ...filtered], callback);
}

async.eachSeries(locrian, sampleOne, () => {
	process.exit();
});

// console.log({ filtered });
// process.exit();

// console.log(scales.list());
// process.exit();

// const programChange = {
// 	type: 'programChange',
// 	programNumber: 32
// };
// keys.play([programChange, ...filtered, ...filtered], () => {
// 	keys.exit();
// });


// const loop = new GameLoop({
// 	delay: 1000
// });

// const dummyId = loop.add(random1(keys));
//const hatsId = loop.add(hats(keys));
//const bassDrumId = loop.add(bassDrum(keys));
//console.log({ dummyId });

//loop.start();
