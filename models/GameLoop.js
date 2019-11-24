/*

	https://nodejs.dev/understanding-setimmediate/

*/

//let Controller = require('node-pid-controller');

function callAll(state, method, args){
		Object.keys(state).forEach(id => {
			if(!state[id][method]){
				return;
			}
			state[id][method](args);
		});
}
/*
http://eprints.gla.ac.uk/3815/1/IEEE_CS_PID_01580152.pdf

                Rise Time        Overshoot  Settling Time    Steady-State Error    Stability
Increasing KP   Decrease         Increase   Small Increase   Decrease              Degrade
Increasing KI   Small Decrease   Increase   Increase         Large Decrease        Degrade
Increasing K D  Small Decrease   Decrease   Decrease         Minor Change          Improve
*/
function PIDController(target){
	// best 0, 0.45, 0.1
	const controller = new Controller({
		k_p: 0.00,
		k_i: 0.55,
		k_d: 0.2,
		//dt: delay/1000
	});
	controller.setTarget(target);
	return controller;
}

class GameLoop {

	constructor({
		delay = 1000
	} = {}){
		this.state = {};
		this.delay = delay;

		//this.controller = PIDController(this.delay);

		['loop', 'update', 'render', 'start', 'stop', 'pause', 'resume', 'add', 'remove']
			.forEach(method => {
				if(!this[method]){
					return console.log(`Trouble finding method ${method}`);
				}
				this[method] = this[method].bind(this);
			});
	}

	add(item){
		//console.log({ item });
		const id = item.name;
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

		const offset = 0; /*this.controller.update(
			this.lastRender
				? progress
				: this.delay
		);*/
		//console.log({ offset });
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
