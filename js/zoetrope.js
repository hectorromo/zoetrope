const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


class Zoetrope {
	constructor(container) {
		this.container = $(container);
		this.tileWidth = 150;
		this.fullRotation = 360;
		this.tileArray = [];
		this.slotDraggable = null;
		this.triggerState = true;
		this.tilesNum = 18;
		this.tileMargin = 0;
	}

	init() {
		this.rotationStep = this.fullRotation / this.tilesNum;

		this.zDepth = this.getZDepth(this.tileWidth + this.tileMargin, this.tilesNum);
		// this.tileZOrigin = this.getZOrigin(this.rotationStep);
		// console.log(this.tileZOrigin);
		// this.dynamicPerspective = this.getPerspective();
		this.setupHTML();
		this.setupNullObj();
		this.createTiles();
		this.setDraggable();
		// this.listen();
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

	// listen() {
        // console.log('zoetrope:listening');
		// $('#slot-trigger').addEventListener('click', this.handleClick);
		// EVT.on('modalClose', Slot.enable);
		// EVT.on('slotComplete', Slot.disable);
	// }
	
	createTiles() {
		const self = this;
		for (let i = 0; i < this.tilesNum; i++) {
			let tile = document.createElement('li');
			let fileNumber = (i < 10) ? '0' + i : i;
			let itemBack = document.createElement('div');

			console.log(fileNumber);
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
			dragResistance: 0.5,
			throwResistance: 1200,
			minDuration: 4,
			throwProps: true,
			zIndexBoost: true,
			onDrag: () => self.onUpdate.call(self),
			// onDragEnd: self.onInteractionEnd,
			onThrowUpdate: () => self.onUpdate.call(self)
			// onThrowComplete: self.onComplete
			// ease: Back.easeOut.config(0.2)
		});
	}

	handleClick() {
		if (!this.triggerState) {return}

		let yPos = Math.floor(Math.random() * ( Math.floor(2000) - Math.ceil(-2000) ) ) + (-2000);
		let endValue = Math.round(yPos / this.rotationStep) * this.rotationStep;

		// this.setActiveTile(endValue);
		
		TweenLite.to(this.nullObject, 2, {
			y: endValue,
			onUpdate: this.onUpdate,
			// onComplete: this.onComplete,
			ease: Back.easeOut.config(0.2)
		});
	}

	onUpdate() {
		let destX = this.nullObject._gsTransform.x % this.fullRotation;
		let velocity = ThrowPropsPlugin.getVelocity(this.nullObject, 'y');
		// let step = Math.abs(Math.round(destX) % 30);
		// let maxValue = (velocity > 2800) ? 25: 22;
		// let minValue = (velocity > 2500) ? 6: 8;

		// console.log(ThrowPropsPlugin.getVelocity(Slot.nullObject, 'y'))
		
		// if(Slot.newStep && step > minValue && step < maxValue) {
		// 	EVT.emit('tileScrolled');
		// 	Slot.newStep = false;
		// } else if (step < minValue || step > maxValue) {
		// 	Slot.newStep = true;
		// }

		TweenLite.set(this.el, {
			rotationY: destX
		});
	}

	// onComplete() {
		// EVT.emit('slotComplete', Slot.activeTile);
		// setTimeout(function() {
		// 	EVT.emit('highlightTile', this.activeTile);
		// }, 400);
	// }

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