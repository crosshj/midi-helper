const MidiChord = require('./MidiChord');
const ScalesPack = require('./ScalesPack');
const scales = new ScalesPack();

const distinct = (value, index, self) => self.indexOf(value) === index;

const expectEachArrayObject = (array, assert) =>
	expect(array).toEqual(
		expect.arrayContaining([
			expect.objectContaining(assert)
		])
	);

it('should construct chord from midi series', () => {
	//arrange
	const series = scales.getMidiSorted('c_major').notes;
	const chord = new MidiChord({ series });

	//act
	const midi = chord.arp();

	//assert
	expect(midi).toEqual(series);
});


it('should reverse chord arpeggio', () => {
	//arrange
	const series = scales.getMidiSorted('c_major').notes;
	const chord = new MidiChord({ series });

	//act
	const midi = chord.arp({ direction: 'reverse' });

	//assert
	expect(midi.map(x => x.noteNumber).filter(distinct))
		.toEqual(chord.notes.reverse());
});

it('should construct chord from midi chord', () => {
	//arrange
	const chord = scales.getMidiSorted('c_major').chords.triads[1];
	//console.log({ chord });
	const midiChord = new MidiChord({ series: chord });

	//act
	const midi = midiChord.strum();

	//assert
	expect(midiChord.notes)
		.toEqual(chord.map(x => x.noteNumber).filter(distinct));
	expect(midi).toEqual(chord);
});

it('should reverse strum chord', () => {
	//arrange
	const chord = scales.getMidiSorted('c_major').chords.triads[1];
	//console.log({ chord });
	const midiChord = new MidiChord({ series: chord });

	//act
	const midi = midiChord.strum({ direction: 'reverse' });

	//assert
	expect(midi.map(x => x.noteNumber).filter(distinct))
		.toEqual(midiChord.notes.reverse());
});

it('should strum chord with delay', () => {
	//arrange
	const chord = scales.getMidiSorted('c_major').chords.triads[1];
	//console.log({ chord });
	const midiChord = new MidiChord({ series: chord });
	const delay = 50;

	//act
	const midi = midiChord.strum({ delay });

	//assert
	const sourceNoteOffDelay = chord.find(x => x.type === "noteOff").deltaTime;
	const strumNoteOffDelay = (midiChord.notes.length - 1) * delay;
	const midiNoteOffDelay = midi.find(x => x.type === "noteOff").deltaTime;
	//console.log({ sourceNoteOffDelay, strumNoteOffDelay, midiNoteOffDelay });
	expect(midiNoteOffDelay).toEqual(sourceNoteOffDelay - strumNoteOffDelay);

	const followingNoteOns = midi.filter(x => x.type === "noteOn").filter((x, i) => i);
	//console.log({ followingNoteOns });
	expectEachArrayObject(followingNoteOns, { deltaTime: delay });
});

