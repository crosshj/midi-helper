/*

*/
//const path = require('path');
var AdmZip = require('adm-zip');

const scalesZipLocation = './reference/scale_chords_small.zip';
const parseMidi = require('midi-file').parseMidi;

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

}

module.exports = ScalesPack;
