const clone = obj => JSON.parse(JSON.stringify(obj));

const random1 = (keys) => {
	let track = keys.readFile('2HARMO3E.MID').tracks;
	track[0].programNumber = 116;//32; //32, 39, 45, 50, 76, 78, 80, 95, 97, 101, 116
	track[1].velocity = 50;
	track[2].velocity = 50;
	track = track.filter(x => x.noteNumber ? x.noteNumber === 67 /*&& x.type === 'noteOn'*/: true)
	track.forEach(x => x.channel = 2);
	//console.dir(track);
	let _track = clone(track);

	return {
		name: 'test',
		render: () => {
			//process.stdout.write('-');
			keys.play(_track, ()=>{});
		},
		update: ({ progress }) => {
			_track = clone(track);
			//console.log(progress);
			const instruments = [32, 39, 45, 50, 76, 78, 80, 95, 97, 101, 116];
			_track[0].programNumber = instruments[Math.floor(Math.random()*instruments.length)];

			const NOTE = Math.floor(Math.random() * 32)+ 35;
			_track[1].noteNumber = NOTE;
			_track[2].noteNumber = NOTE;
			_track[2].deltaTime = 1000;

			// louder pads
			if([95, 101].includes(_track[0].programNumber)){
				_track[1].velocity = 127;
				_track[2].deltaTime = 2000;
			}

			// bottle blow, whistle
			if([76, 78].includes(_track[0].programNumber)){
				_track[1].velocity = 70;
				_track[2].deltaTime = 500;


				_track[3] = clone(_track[1]);
				_track[4] = clone(_track[2]);

				_track[3].noteNumber = Math.floor(Math.random() * 32)+ 35;
				_track[4].noteNumber = _track[3].noteNumber;

			}
		}
	};
};

module.exports = random1;
