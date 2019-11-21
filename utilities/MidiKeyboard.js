const fs = require('fs');
const parseMidi = require('midi-file').parseMidi;
const midi = require('midi');
const async = require('async');

// https://github.com/SpotlightKid/python-rtmidi/blob/master/rtmidi/midiconstants.py
const NOTE_ON /* channel 1 */ = 144;
const NOTE_OFF /* channel 1 */ = 128;
const PROGRAM_CHANGE /* channel 1 */ = 192;

/* this overrides patch in track */
const VOLUME = 42;

// https://www.midi.org/specifications-old/item/gm-level-1-sound-set
// JSON.stringify(Array.from(document.querySelectorAll('#foo tr td:last-child')).filter((x,i) => i > 2).map(x => x.innerText))
const patchMap = ["Acoustic Grand Piano","Bright Acoustic Piano","Electric Grand Piano","Honky-tonk Piano","Electric Piano 1","Electric Piano 2","Harpsichord","Clavi","Celesta","Glockenspiel","Music Box","Vibraphone","Marimba","Xylophone","Tubular Bells","Dulcimer","Drawbar Organ","Percussive Organ","Rock Organ","Church Organ","Reed Organ","Accordion","Harmonica","Tango Accordion","Acoustic Guitar (nylon)","Acoustic Guitar (steel)","Electric Guitar (jazz)","Electric Guitar (clean)","Electric Guitar (muted)","Overdriven Guitar","Distortion Guitar","Guitar harmonics","Acoustic Bass","Electric Bass (finger)","Electric Bass (pick)","Fretless Bass","Slap Bass 1","Slap Bass 2","Synth Bass 1","Synth Bass 2","Violin","Viola","Cello","Contrabass","Tremolo Strings","Pizzicato Strings","Orchestral Harp","Timpani","String Ensemble 1","String Ensemble 2","SynthStrings 1","SynthStrings 2","Choir Aahs","Voice Oohs","Synth Voice","Orchestra Hit","Trumpet","Trombone","Tuba","Muted Trumpet","French Horn","Brass Section","SynthBrass 1","SynthBrass 2","Soprano Sax","Alto Sax","Tenor Sax","Baritone Sax","Oboe","English Horn","Bassoon","Clarinet","Piccolo","Flute","Recorder","Pan Flute","Blown Bottle","Shakuhachi","Whistle","Ocarina","Lead 1 (square)","Lead 2 (sawtooth)","Lead 3 (calliope)","Lead 4 (chiff)","Lead 5 (charang)","Lead 6 (voice)","Lead 7 (fifths)","Lead 8 (bass + lead)","Pad 1 (new age)","Pad 2 (warm)","Pad 3 (polysynth)","Pad 4 (choir)","Pad 5 (bowed)","Pad 6 (metallic)","Pad 7 (halo)","Pad 8 (sweep)","FX 1 (rain)","FX 2 (soundtrack)","FX 3 (crystal)","FX 4 (atmosphere)","FX 5 (brightness)","FX 6 (goblins)","FX 7 (echoes)","FX 8 (sci-fi)","Sitar","Banjo","Shamisen","Koto","Kalimba","Bag pipe","Fiddle","Shanai","Tinkle Bell","Agogo","Steel Drums","Woodblock","Taiko Drum","Melodic Tom","Synth Drum","Reverse Cymbal","Guitar Fret Noise","Breath Noise","Seashore","Bird Tweet","Telephone Ring","Helicopter","Applause","Gunshot"];
const xgLitePatchMap = [];

const convertTime = (deltaTime) => {
    if(!deltaTime){
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

const playNote = (output, convertTime) => (note, callback) => {
    const { deltaTime, type, noteNumber, velocity, programNumber } = note;
    if (type === "programChange"){
        const CC = 176; //channel 1
        const BANK_SELECT_MSB = 0;
        const BANK_SELECT_LSB = 32;
        const msb = [
            CC,
            BANK_SELECT_MSB,
            64
        ];
        //output.sendMessage(msb);
        const lsb = [
            CC,
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
        */
        const note = [
            PROGRAM_CHANGE,
            programNumber
        ];
        output.sendMessage(note);

        console.dir({ programNumber, patch: patchMap[programNumber] })
        return callback();
    }
    const convertedNote = [
        type === 'noteOn' ? NOTE_ON : NOTE_OFF,
        55 || noteNumber,
        VOLUME || velocity
    ];

    setTimeout(() => {
        output.sendMessage(convertedNote);
        //console.log(`${JSON.stringify(convertedNote)} - ${convertTime(deltaTime)}`);
        callback();
    }, convertTime(deltaTime));
};


class MidiKeyboard {

	constructor({ port = 1} = {}){
		this.output = new midi.Output();
		this.output.openPort(port);

		['play', 'closePort'].forEach(method => {
			this[method] = this[method].bind(this);
		});
	}

	readFile(filename = '2HARMO3E.MID'){
		return readMidi(filename);
	}

	play(notes, callback){
		const play = playNote(this.output, convertTime);

		if(Array.isArray(notes)){
			async.eachSeries(notes, play, callback);
			return;
		}
		play(notes, callback);
	}

	closePort(){
		this.output.closePort();
	}

}

module.exports = MidiKeyboard;
