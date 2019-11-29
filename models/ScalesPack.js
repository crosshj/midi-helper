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

		//const foo = chords.map(x => x[0].deltaTime);
		//console.log(foo);
		//console.log(chords[0]);
		// console.log(chords[0][3]);

		const triads = chords
			.filter(c => c.length === 6)
			.reduce((all, one, index) => {
				if(index > 0 && one[0].deltaTime > 0){
					all.stop = true;
				}
				if(!all.stop){
					all = [...all, one];
				}
				return all;
			}, []);
		triads[0][0].deltaTime = 0;
		//console.log(triads.length)

		const fourNote = [].concat.apply([], chords.slice(5));
		fourNote[0].deltaTime = 0;

		return {
			notes: [].concat.apply([], notes),
			chords: {
				all: [].concat.apply([], chords),
				triads: {
					all: [].concat.apply([], triads),
					1: triads[0],
					2: triads[1],
					3: triads[2],
					4: triads[3],
					5: triads[4],
					6: triads[5],
					7: triads[6]
				},
				fourNote,
			}
		}
	}

}

module.exports = ScalesPack;
