/*

	https://nodejs.dev/understanding-setimmediate/

*/

class GameLoop {

	constructor({
		keyboard, delay
	} = {}){
		this.keyboard = keyboard;
		this.state = {};
		this.delay = 1000;
		this.lastRender = 0;

		['loop', 'update', 'render', 'start', 'stop', 'pause', 'resume', 'add', 'remove']
			.forEach(method => {
				if(!this[method]){
					return console.log(`Trouble finding method ${method}`);
				}
				this[method] = this[method].bind(this);
			});
	}

	add(item){
		const id = 'fooo';
		this.state[id] = item;
		return id;
	}

	remove(id){
		if(!this.state[id]){
			console.log(`Could not find item with id: ${id}`);
			return;
		}
		delete this.state[id];
	}

	loop(){
		const timestamp = Date.now();
		const progress = timestamp - this.lastRender;

		this.update(progress);
		this.render();

		this.lastRender = timestamp;
		setTimeout(this.loop, this.delay);
	}

	update(){
		// this is where all world objects are updated
		// examples of world objects: keypress, notes/loops, etc..
	}

	render(){
		// this is where keyboard sends notes and control messages
		process.stdout.write('*');
	}



	// loop related
	start(){
		this.loop();
	}

	stop(){

	}

	pause(){

	}

	resume(){

	}

	rewind(){

	}

}

module.exports = GameLoop;
