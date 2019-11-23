const MidiKeyboard = require('./models/MidiKeyboard');
const GameLoop = require('./models/GameLoop');

const loop = new GameLoop({
	delay: 1000
});
const dummyId = loop.add({
	name: 'test',
	render: () => {
		process.stdout.write('-');
	},
	update: ({ progress }) => {
		console.log(progress);
	}
});
console.log({ dummyId });
loop.start();




// const keys = new MidiKeyboard();
// let track = keys.readFile().tracks;

// const clone = obj => JSON.parse(JSON.stringify(obj));
// track[0].programNumber = 128;//32; //32, 39, 45, 50, 76, 78, 80, 95, 97, 101, 116
// track = track.filter(x => x.noteNumber ? x.noteNumber === 67 /*&& x.type === 'noteOn'*/: true)
// console.table(track);


// const newTrack = (new Array(128)).fill()
// 	.reduce((all, one, index) => {
// 		const _track = clone(track);
// 		_track[0].programNumber = 97; //index;

// 		const NOTE = Math.floor(index/8 + 35);
// 		_track[1].noteNumber = NOTE;
// 		_track[2].noteNumber = NOTE;
// 		_track.forEach(t => all.push(t));

// 		return all;
// 	}, []);
// //console.table(newTrack);
// console.table([newTrack[2], newTrack[3], newTrack[4]]);

// keys.play(newTrack, () => {
// 	keys.exit();
// });

