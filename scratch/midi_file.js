var fs = require('fs');

var parseMidi = require('midi-file').parseMidi;
var writeMidi = require('midi-file').writeMidi;

var input = fs.readFileSync('2HARMO3E.MID');
var parsed = parseMidi(input);

const { header, tracks } = parsed;

console.log({ header });
console.log({
    metaTracks: tracks[0].filter(x => x.meta),
    tracks: tracks[0].filter(x => !x.meta)
});

// make the original play longer
//tracks[0].filter(x => !x.meta)[3].deltaTime = 9999;

var output = writeMidi(parsed);
var outputBuffer = new Buffer.from(output);

fs.writeFileSync('2HARMO3E_copy.MID', outputBuffer);
