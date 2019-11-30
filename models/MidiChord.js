const clone = o => JSON.parse(JSON.stringify(o));
const distinct = (value, index, self) => self.indexOf(value) === index;

class MidiChord {

	constructor({
		channel = 0,
		notes,
		velocity = 100,
		duration,
		repeat = 0,
		series
	} = {}) {
		this.fromMidiSeries = this.fromMidiSeries.bind(this);
		this.strum = this.strum.bind(this);
		this.arp = this.arp.bind(this);

		if (series) {
			this.fromMidiSeries(arguments[0]);
		}
		this.channel = channel || this.channel;
		this.notes = notes || this.notes;
		this.velocity = velocity || this.velocity;
		this.duration = duration || this.duration;
		this.repeat = repeat;
	}

	fromMidiSeries({ series }) {
		//console.log(series);
		this.channel = series[1].channel;
		this.notes = series
			.map(x => x.noteNumber)
			.filter(distinct);
		this.velocity = series
			.reduce((all, one) =>
				one.velocity > all
					? one.velocity
					: all
				, 0);
		this.duration = series
			.reduce((all, one) =>
				one.deltaTime > all
					? one.deltaTime
					: all
				, 0);
	}

	strum({ delay = 0, direction = "forward", hold = 0 } = {}) {
		// is time === time between notes?
		const notes = direction === "reverse"
			? clone(this.notes).reverse()
			: this.notes
		const out = notes.reduce((all, noteNumber, i) => {
			all.push({
				deltaTime: i === 0 ? 0 : delay,
				channel: this.channel,
				type: 'noteOn',
				noteNumber,
				velocity: this.velocity
			});
			return all;
		}, []);

		const totalDelay = (notes.length - 1) * delay;
		notes.forEach((noteNumber, i) => {
			out.push({
				deltaTime: i === 0 ? this.duration - totalDelay + hold : 0,
				channel: this.channel,
				type: 'noteOff',
				noteNumber,
				velocity: this.velocity
			});
		});
		//console.log(out);
		return out;
	}

	arp({ time = 150, direction = "forward" } = {}) {
		// is time === time between notes?
		const notes = direction === "reverse"
			? clone(this.notes).reverse()
			: this.notes
		const out = notes.reduce((all, noteNumber, i) => {
			all.push({
				deltaTime: 0,
				channel: this.channel,
				type: 'noteOn',
				noteNumber,
				velocity: this.velocity
			});
			all.push({
				deltaTime: this.duration,
				channel: this.channel,
				type: 'noteOff',
				noteNumber,
				velocity: this.velocity
			});
			return all;
		}, []);
		//console.log(out);
		return out;
	}
}

module.exports = MidiChord;
