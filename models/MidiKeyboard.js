const fs = require('fs');
const parseMidi = require('midi-file').parseMidi;
const midi = require('midi');
const async = require('async');

// https://github.com/SpotlightKid/python-rtmidi/blob/master/rtmidi/midiconstants.py
const NOTE_ON /* channel 1 */ = 144;
const NOTE_OFF /* channel 1 */ = 128;
const PROGRAM_CHANGE /* channel 1 */ = 192;
const CC = 176; //channel 1

const BANK_SELECT_MSB = 0;
const BANK_SELECT_LSB = 32;

/* this overrides patch in track */
const VOLUME = 50;

const patchMap = require('../maps/gm_map.js').synths;
const noteMap = require('../maps/notes.js');
const xgLitePatchMap = [];

const convertTime = (deltaTime) => {
	if (!deltaTime) {
		return 0;
	}
	//TODO: should look at header info and determine this instead
	return Number((deltaTime / 8).toFixed(2));
};

const readMidi = (filename) => {
	var input = fs.readFileSync(filename);
	var parsed = parseMidi(input);

	const { header, tracks } = parsed;

	//console.log({ header });
	const chunked = {
		metaTracks: tracks[0].filter(x => x.meta),
		tracks: tracks[0].filter(x => !x.meta)
	};
	//console.log(chunked)
	return chunked;
};

let currentProgram;
const playNote = (output, convertTime) => (note, callback) => {
	const { deltaTime, type, noteNumber, velocity, programNumber, channel = 0 } = note;
	if (type === "programChange") {
		if (currentProgram === programNumber) {
			return callback();
		}
		currentProgram = programNumber;
		const msb = [
			CC + channel,
			BANK_SELECT_MSB,
			64
		];
		//output.sendMessage(msb);
		const lsb = [
			CC + channel,
			BANK_SELECT_LSB,
			0
		];
		//output.sendMessage(lsb);
        /*
          Should send these before program change (true program change)
          https://www.sweetwater.com/sweetcare/articles/6-what-msb-lsb-refer-for-changing-banks-andprograms/

          CC 000 nnn (Bank Select MSB – Most Significant Byte)
          CC 032 nnn (Bank Select LSB – Least Significant Byte)

          https://usa.yamaha.com/files/download/other_assets/1/768411/dgx230_en_om_b0.pdf

          https://www.midi.org/specifications/item/table-1-summary-of-midi-message
          https://users.cs.cf.ac.uk/Dave.Marshall/Multimedia/node158.html

          http://www.music-software-development.com/midi-tutorial.html
        */
		const note = [
			PROGRAM_CHANGE + channel,
			programNumber
		];
		output.sendMessage(note);

		console.log(`${programNumber}: ${patchMap[programNumber]}`);
		return callback();
	}

	const convertedNote = [
		type === 'noteOn'
			? NOTE_ON + channel
			: NOTE_OFF + channel,
		noteNumber,
		velocity
	];

	setTimeout(() => {
		output.sendMessage(convertedNote);
		//console.log(`${JSON.stringify(convertedNote)} - ${convertTime(deltaTime)}`);
		if (type === 'noteOn') {
			console.log(`${noteNumber}: ${noteMap[noteNumber].note || 'XX'} - ${(noteMap[noteNumber].freq + 'Hz')}`);
		}
		callback();
	}, convertTime(deltaTime));
};

class MidiKeyboard {

	constructor({ port = 1 } = {}) {
		this.output = new midi.Output();
		this.output.openPort(port);

		['play', 'closePort', 'exit']
			.forEach(method => {
				this[method] = this[method].bind(this);
			});
		[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`]
			.forEach((eventType) => {
				process.on(eventType, this.exit);
			});
	}

	readFile(filename = '2HARMO3E.MID') {
		return readMidi(filename);
	}

	play(notes, callback) {
		const play = playNote(this.output, convertTime);

		if (Array.isArray(notes)) {
			async.eachSeries(notes, play, callback);
			return;
		}
		play(notes, callback);
	}

	closePort() {
		this.output.closePort();
	}

	exit() {
		if (this.exiting) {
			return process.exit();
		}
		this.exiting = true;
		//see also https://github.com/jprichardson/node-death
		setTimeout(() => {
			const allChannels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
			allChannels.forEach(i => {
				const allNotesOff = [
					CC + i,
					123,
					0
				];
				this.output.sendMessage(allNotesOff);
			})

			this.output.closePort();
			process.exit();
		}, 1);

	}

}

module.exports = MidiKeyboard;
