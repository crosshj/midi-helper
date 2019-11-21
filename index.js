const MidiKeyboard = require('./utilities/MidiKeyboard');
const keys = new MidiKeyboard();

let track = keys.readFile().tracks;

const clone = obj => JSON.parse(JSON.stringify(obj));
track[0].programNumber = 128;//32; //32, 39, 45, 50, 76, 78, 80, 95, 97, 101, 116
track = track.filter(x => x.noteNumber ? x.noteNumber === 67 : true)
console.table(track);


const newTrack = (new Array(128)).fill()
	.reduce((all, one, index) => {
		const newTrack = clone(track);
		newTrack[0].programNumber = index;
		newTrack.forEach(t => all.push(t));
		return all;
	}, []);
//console.table(newTrack);

keys.play(newTrack, () => {
	keys.closePort();
});

