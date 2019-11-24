const clone = obj => JSON.parse(JSON.stringify(obj));

const random128 = () => Math.floor(Math.random() * 100) + 27;

const addNotes = (track) => {
	track[1].velocity = random128();
	track[3] = clone(track[1]);
	track[4] = clone(track[2]);

	track[1].velocity = random128();
	track[5] = clone(track[1]);
	track[6] = clone(track[2]);

	track[1].velocity = random128();
	track[7] = clone(track[1]);
	track[8] = clone(track[2]);

	track[1].velocity = random128();
	track[9] = clone(track[1]);
	track[10] = clone(track[2]);

	track[1].velocity = random128();
	track[11] = clone(track[1]);
	track[12] = clone(track[2]);

	track[1].velocity = random128();
	track[13] = clone(track[1]);
	track[14] = clone(track[2]);

	track[1].velocity = random128();
	track[15] = clone(track[1]);
	track[16] = clone(track[2]);

	// track[1].velocity = random128();
	// track[17] = clone(track[1]);
	// track[18] = clone(track[2]);

	// track[1].velocity = random128();
	// track[19] = clone(track[1]);
	// track[20] = clone(track[2]);

	// track[1].velocity = random128();
	// track[21] = clone(track[1]);
	// track[22] = clone(track[2]);

};

const random1 = (keys) => {
	let track = keys.readFile('2HARMO3E.MID').tracks;
	track[0].programNumber = 120;
	track = track.filter(x => x.noteNumber ? x.noteNumber === 67 /*&& x.type === 'noteOn'*/: true)
	track[1].noteNumber = 97;
	//track[1].velocity = 127;
	track[1].velocity = random128();

	track[2].noteNumber = track[1].noteNumber;
	track[2].velocity = track[1].velocity;
	track[2].deltaTime = 1000;
	//track[1].noteNumber = 115;

	track.forEach(x => x.channel = 3);

	let _track = clone(track);
	return {
		name: 'hats',
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
