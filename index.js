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

const keys = new MidiKeyboard();

const filtered = range({
	start: 1,
	//length: 11,
	source: scales.getMidi('d_phrygian').tracks[0]
});
// console.log({ filtered });
// process.exit();

// console.log(scales.list());
// process.exit();

const programChange = {
	type: 'programChange',
	programNumber: 31
};
keys.play([programChange, ...filtered, ...filtered, ...filtered, ...filtered, ...filtered], () => {
	keys.exit();
});


const loop = new GameLoop({
	delay: 1000
});

const dummyId = loop.add(random1(keys));
const hatsId = loop.add(hats(keys));
const bassDrumId = loop.add(bassDrum(keys));
//console.log({ dummyId });

//loop.start();
