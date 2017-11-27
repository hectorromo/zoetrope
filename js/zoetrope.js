const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

class Sound {
	constructor() {
		this.file = new Howl({
	      src: ['./sounds/s.mp3'],
	      // src: ['./sounds/r.mp3'],
	      loop: true
	    });
	}
}

class Zoetrope {
	constructor(container) {
		this.container = $(container);
		this.tileWidth = 150;
		this.fullRotation = 360;
		this.tileArray = [];
		this.slotDraggable = null;
		this.triggerState = true;
		this.tilesNum = 18;
		this.tileMargin = 75;
	}

	init() {
		this.rotationStep = this.fullRotation / this.tilesNum;

		this.zDepth = this.getZDepth(this.tileWidth + this.tileMargin, this.tilesNum);
		// this.tileZOrigin = this.getZOrigin(this.rotationStep);
		// console.log(this.tileZOrigin);
		// this.dynamicPerspective = this.getPerspective();
		this.setupAudio();
		this.setupHTML();
		this.setupNullObj();
		this.createTiles();
		this.setDraggable();
		this.listen();
	}

	setupAudio() {
		this.player = new Sound();
	}

	setupHTML() {
		TweenLite.set(this.container, {
			transform: 'rotateX(-12deg)',
			transformStyle: 'preserve-3d',
			height: '100vh'
		});

		this.el = document.createElement('ul');
		this.el.className = 'zoetrope';
		this.container.appendChild(this.el);
	}

	setupNullObj() {
		this.nullObject = document.createElement('div');
		this.nullObject.className = 'null-object';
		$('body').appendChild(this.nullObject);

		TweenLite.set(this.nullObject, {
			position: 'absolute',
			x: 0
		});
	}

	listen() {
		console.log('listening');
		let self = this;
		$$('.controls button').forEach(() => {
			addEventListener('click', (e) => {
				self.handleClick(e, self);
			});
		})
  //       console.log('zoetrope:listening');
		// $('#slot-trigger').addEventListener('click', this.handleClick);
		// EVT.on('modalClose', Slot.enable);
		// EVT.on('slotComplete', Slot.disable);
	}
	
	createTiles() {
		const self = this;
		for (let i = 0; i < this.tilesNum; i++) {
			let tile = document.createElement('li');
			let fileNumber = (i < 10) ? '0' + i : i;
			let itemBack = document.createElement('div');

			itemBack.className = "item-back";
			itemBack.style.backgroundImage = 'url(./images/file00' + fileNumber + '.jpg)';
			// '<div class="item-back"></div>';

			tile.className = 'item';
			tile.innerHTML = `<div class="item-front">${i}</div>`;
			
			tile.appendChild(itemBack);

			tile.initRotationY = 0;
			tile.initRotationX = i * self.rotationStep;

			TweenLite.set(tile, {
				position: 'absolute',
				// height: '100%',
				width: self.tileWidth + 'px',
				overflow: 'hidden',
				// zIndex: -i,
				// backfaceVisibility: 'hidden',
				// backgroundColor: 'green',
				transform: 'rotateY('+ (i * self.rotationStep) +'deg) translateZ('+ self.zDepth +'px)'
			});

			self.tileArray.push(tile);
			self.el.appendChild(tile);
		}
	}

	setDraggable() {
		const self = this;
		this.slotDraggable = Draggable.create(this.nullObject, {
			type: 'x',
			lockAxis: true,
			trigger: this.container,
			dragResistance: 0.1,
			throwResistance: 10,
			minDuration: 100,
			throwProps: true,
			zIndexBoost: true,
			onDrag: () => self.onUpdate.call(self),
			onThrowUpdate: () => self.onUpdate.call(self),
			onThrowComplete: () => self.onComplete.call(self)
		});
	}

	handleClick(e, self) {
		if (e.target.classList.contains('play')) {
			TweenLite.ticker.addEventListener("tick", self.animateNull, self, true, 1);
		} else {
			TweenLite.ticker.removeEventListener("tick", self.animateNull);
			this.pauseAudio()
			// clearInterval(self.animateInterval);
		}
		
		// TweenLite.to(this.nullObject, 2, {
		// 	y: endValue,
		// 	onUpdate: this.onUpdate,
		// 	// onComplete: this.onComplete,
		// 	ease: Back.easeOut.config(0.2)
		// });
	}

	animateNull() {
		let self = this;
		// console.log(this.nullObject._gsTransform.x);
		// let endValue = this.nullObject._gsTransform.x+1200;
		TweenLite.to(self.nullObject, 1, {
			x: '+=5590',
			onUpdate: self.onUpdate.call(self),
			ease: Back.easeIn
			// onComplete: this.onComplete.call(self)
		});
	}

	pauseAudio() {
		this.player.file.pause();
		this.isPlaying = false;
	}

	playAudio(rate) {
		let velocity = (rate > 1) ? 1 : rate;

		if(!this.isPlaying) {
			this.sound = this.player.file.play();
			this.isPlaying = true;
		}

		this.player.file.rate(velocity, this.sound);
	}

	onUpdate() {
		let destX = this.nullObject._gsTransform.x % this.fullRotation;
		let velocity = Math.round(ThrowPropsPlugin.getVelocity(this.nullObject, 'x')) / 1000;
		// console.log(Math.abs(velocity));
		console.log(velocity);
		this.playAudio( Math.abs(velocity) * 4);

		TweenLite.set(this.el, {
			rotationY: destX
		});
	}

	onComplete() { 
		this.pauseAudio()
	}

	disable() {
		this.triggerState = false;
		this.slotDraggable[0].disable();
	}

	enable() {
		this.triggerState = true;
		this.slotDraggable[0].enable();
	}

	getZDepth(tileWidth, tilesNum) {
		return tileWidth / (2 * Math.tan( Math.PI / tilesNum ));
	}

	getZOrigin() {	
		return Math.round((window.innerWidth/2) / Math.tan(this.DegreesToRadians((this.rotationStep/2))));
	}

	DegreesToRadians(valDeg) {
		return ((2*Math.PI)/this.fullRotation*valDeg)
	}

	getPerspective() {
		return (this.rotationStep/this.fullRotation) * 2500;
	}

}