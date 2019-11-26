const clone = obj => JSON.parse(JSON.stringify(obj));
const range = ({ start = 0, end = 0, length = 0, source }) => source.filter(
	(a, i, arr) => {
		const arrayEndFilter = i <= (arr.length - end);
		const arrayStartFilter = i >= start;
		const arrayLengthFilter = length
			? i < length + start
			: true;
		//console.log({ i, arr: arr.length });
		//i <= 10 && console.log(arrayEndFilter, arrayStartFilter, arrayLengthFilter);
		return arrayEndFilter && arrayStartFilter && arrayLengthFilter;
	}
);
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

module.exports = {
	clone, range, shuffle
};
