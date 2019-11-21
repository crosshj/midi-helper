const fs = require('fs');
const async = require('async');
const parseMidi = require('midi-file').parseMidi;
const midi = require('midi');

// https://github.com/SpotlightKid/python-rtmidi/blob/master/rtmidi/midiconstants.py

const NOTE_ON /* channel 1 */ = 144;
const NOTE_OFF /* channel 1 */ = 128;

const PROGRAM_CHANGE /* channel 1 */ = 192;

/* this overrides patch in track */
const PATCHNUMBER = 13;  //(381 is 446 on keyboard)
const NOTENUMBER = 44; //44;
const VOLUME = 127;
const REPEAT = 1900;

const readMidi = () => {
    var input = fs.readFileSync('2HARMO3E.MID');
    var parsed = parseMidi(input);

    const { header, tracks } = parsed;

    //console.log({ header });
    const chunked = {
        metaTracks: tracks[0].filter(x => x.meta),
        tracks: tracks[0].filter(x => !x.meta)
    };
    //console.log(chunked)
    return chunked;
}

const playOneNote = (output, convertTime) => (note, callback) => {
    const { deltaTime, type, noteNumber, velocity, programNumber } = note;
    if (type === "programChange"){
        const note = [
            PROGRAM_CHANGE,
            PATCHNUMBER || programNumber
        ];
        output.sendMessage(note);
        return callback();
    }
    const convertedNote = [
        type === 'noteOn' ? NOTE_ON : NOTE_OFF,
        NOTENUMBER || noteNumber,
        VOLUME || velocity
    ];
    setTimeout(() => {
        output.sendMessage(convertedNote);
        //console.log(`${JSON.stringify(convertedNote)} - ${convertTime(deltaTime)}`);
        callback();
    }, convertTime(deltaTime));
}

const playNotes = (output) => (notes, callback) => {
    const convertTime = (deltaTime) => {
        if(!deltaTime){
            return 0;
        }
        //TODO: should look at header info and determine this instead
        return Number((deltaTime / 8).toFixed(2));
    };
    async.eachSeries(notes, playOneNote(output, convertTime), callback);
};

const playMidi = (track) => {
    const output = new midi.Output();
    //const PORT = 0;
    const PORT = 1;
    output.openPort(PORT);

    playNotes(output)(track, () => {
        output.closePort();
    });
};

const track = readMidi().tracks;
//console.log({ track });
console.log('-- playing');

setInterval(() => {
  playMidi(track);
}, REPEAT)

