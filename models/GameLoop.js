/*

	https://nodejs.dev/understanding-setimmediate/

*/

function callAll(state, method, args){
		Object.keys(state).forEach(id => {
			if(!state[id][method]){
				return;
			}
			state[id][method](args);
		});
}

function PIDController(){

}

class GameLoop {

	constructor({
		delay = 1000
	} = {}){
		this.state = {};
		this.delay = delay;

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

		this.lastRender && this.update(progress);
		this.render();

		const offset = this.lastRender
			? 0.75 * (this.delay - progress) // P in PID
			: 0;
		this.lastRender = timestamp;

		setTimeout(this.loop, this.delay + offset);
	}

	update(progress){
		// this is where all world objects are updated
		// examples of world objects: keypress, notes/loops, etc..
		callAll(this.state, 'update', { progress })
	}

	render(){
		// this is where keyboard sends notes and control messages
		callAll(this.state, 'render')
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
