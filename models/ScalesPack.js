/*

*/
//const path = require('path');
var AdmZip = require('adm-zip');

const scalesZipLocation = './reference/scale_chords_small.zip';
const parseMidi = require('midi-file').parseMidi;

const { clone, range, shuffle } = require('../utilities');

class ScalesPack {

	constructor({
		random
	} = {}) {
		//console.log({ scalesZipLocation });
		this.scalesZip = new AdmZip(scalesZipLocation);

		['list', 'parse', 'getMidi']
			.forEach(method => {
				this[method] = this[method].bind(this);
			});

		this.parse();

		//console.log(this.list());
		//console.log(this.getMidi('a_major').tracks[0]);
		//process.exit()
	}

	parse(){
		//TODO: FILE CACHE ???

		var zipEntries = this.scalesZip.getEntries();

		const scales = {};
		zipEntries.forEach(function(zipEntry) {
			if(!zipEntry.entryName.includes('midi/') || zipEntry.isDirectory){
				return;
			}
			const name = zipEntry.name
				.replace('.mid', '')
				.replace('scale_', '')
				.replace('sharp', '_sharp');

			scales[name] = () => {
				try {
					const zipBuffer = zipEntry.getData();
					return parseMidi(zipBuffer);
				} catch(e){
					console.log(`trouble parsing: ${zipEntry}`);
				}
			};
		});
		this.scales = scales;
	}

	list(){
		return Object.keys(this.scales);
		//console.log(Object.keys(this.scales));
		//console.log(this.scales['e_major']());
	}

	getMidi(name){
		return this.scales[name]();
	}

	getMidiSorted(name){
		const thisMidi = this.getMidi(name).tracks[0]
			.filter(x => ['noteOn', 'noteOff'].includes(x.type));
		const notes = [];
		const chords = [];

		const matched = q => {
			const queueNoteOn = q.filter(x => x.type === 'noteOn');
			const queueNoteOff = q.filter(x => x.type === 'noteOff');
			return queueNoteOn.length === queueNoteOff.length;
		}

		thisMidi.reduce((queue, x) => {
			if(x.type === 'noteOn'){
				queue.push(x);
				return queue;
			}
			if(x.type === 'noteOff' && queue.length === 1){
				notes.push(clone([...queue, x]));
				return [];
			}
			const allNotesMatched = matched([...queue, x]);
			if(x.type === 'noteOff' && allNotesMatched){
				chords.push(clone([...queue, x]));
				return [];
			}
			if(x.type === 'noteOff' && !allNotesMatched){
				queue.push(x)
				return queue;
			}
			console.log('--- weird situation ');
			return queue;
		}, []);

		return {
			notes: [].concat.apply([], notes),
			chords: {
				all: chords,
				triads: chords.slice(0, 6),
				fourNote: chords.slice(7, 14)
			}
		}
	}

}

module.exports = ScalesPack;
