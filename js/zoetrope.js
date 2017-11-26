const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

class Zoetrope {
	constructor(container) {
		this.container = $(container);
		this.tileHeight = 180;
		this.fullRotation = 360;
		this.rotationStep = this.fullRotation / this.tilesNum;
		// this.zDepth = Helpers.getZDepth(this.tileHeight, this.tilesNum),
		// this.tileZOrigin = Helpers.getZOrigin(this.rotationStep),
		// this.dynamicPerspective = Helpers.getPerspective(this.rotationStep, this.fullRotation),

		this.tileArray = [];
		this.slotDraggable = null;
		this.triggerState = true;
	}

	init() {
		console.log('zoetrope:init');
		this.setupHTML();
		this.setupNullObj();
		this.createTiles();
		this.setDraggable();

		// this.listen();
	}

	setupHTML() {
		this.el = document.createElement('div');
		this.el.className = 'zoetrope';
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
		for (let i = 0; i < 10; i++) {
			let tile = document.createElement('li');

			tile.className = 'item';
			tile.innerHTML = `<div class="item-background" style="background-color:green;"></div>
								<div class="item-content">
									<div class="item-image">
										<img src="" alt="">
								</div>
							</div>`;

			tile.initRotationX = 0;
			tile.initRotationY = i * this.rotationStep;

			TweenLite.set(tile, {
				position: 'absolute',
				width: '100%',
				height: this.tileHeight + 'px',
				overflow: 'hidden',
				zIndex: -i,
				backfaceVisibility: 'hidden',
				backgroundColor: 'green',
				transform: 'rotateX('+ -(i * this.rotationStep) +'deg) translateZ('+ this.zDepth +'px)'
			});

			this.tileArray.push(tile);
			this.el.appendChild(tile);
		}
	}

	setDraggable() {
		this.slotDraggable = Draggable.create(this.nullObject, {
			type: 'y',
			lockAxis: true,
			trigger: this.container,
			dragResistance: 0.6,
			throwResistance: 100,
			minDuration: 3,
			throwProps: true,
			onDrag: this.onUpdate,
			zIndexBoost: false,
			onDragEnd: this.onInteractionEnd,
			onThrowUpdate: this.onUpdate,
			onThrowComplete: this.onComplete,
			ease: Back.easeOut.config(0.2),
			snap:{
				y: function(endValue) {
					this.setActiveTile(endValue);
					return Math.round(endValue / this.rotationStep) * this.rotationStep;
				}
			}
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
			onComplete: this.onComplete,
			ease: Back.easeOut.config(0.2)
		});
	}

	onUpdate() {
		let destY = this.nullObject._gsTransform.y % this.fullRotation;
		let velocity = ThrowPropsPlugin.getVelocity(this.nullObject, 'y');
		let step = Math.abs(Math.round(destY) % 30);
		let maxValue = (velocity > 2800) ? 25: 22;
		let minValue = (velocity > 2500) ? 6: 8;

		// console.log(ThrowPropsPlugin.getVelocity(Slot.nullObject, 'y'))
		
		// if(Slot.newStep && step > minValue && step < maxValue) {
		// 	EVT.emit('tileScrolled');
		// 	Slot.newStep = false;
		// } else if (step < minValue || step > maxValue) {
		// 	Slot.newStep = true;
		// }

		TweenLite.set(this.el, {
			rotationX: -destY,
			force3D: true,
		});
	}

	onComlete() {
		// EVT.emit('slotComplete', Slot.activeTile);
		setTimeout(function() {
			EVT.emit('highlightTile', this.activeTile);
		}, 400);
	}

	disable() {
		this.triggerState = false;
		this.slotDraggable[0].disable();
	}

	enable() {
		this.triggerState = true;
		this.slotDraggable[0].enable();
	}
}