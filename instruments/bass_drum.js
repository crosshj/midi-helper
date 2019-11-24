const clone = obj => JSON.parse(JSON.stringify(obj));

const random128 = () => Math.floor(Math.random() * 100) + 27;

const addNotes = (track) => {
	track[3] = clone(track[1]);
	track[4] = clone(track[2]);

	// track[5] = clone(track[1]);
	// track[6] = clone(track[2]);

	// track[7] = clone(track[1]);
	// track[8] = clone(track[2]);
};

const random1 = (keys) => {
	let track = keys.readFile('2HARMO3E.MID').tracks;
	track[0].programNumber = 114;
	track = track.filter(x => x.noteNumber ? x.noteNumber === 67 /*&& x.type === 'noteOn'*/: true)

	track[1].noteNumber = 30;
	track[1].velocity = 20;

	track[2].noteNumber = track[1].noteNumber;
	track[2].velocity = track[1].velocity;
	track[2].deltaTime = 4000;

	track.forEach(x => x.channel = 4);

	let _track = clone(track);
	return {
		name: 'bass_drum',
		render: () => {
			keys.play(_track, ()=>{});
		},
		update: ({ progress }) => {
			_track = clone(track);
			addNotes(_track);
			//console.table(_track);
		}
	};
};

module.exports = random1;
