'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var $ = function $(selector) {return document.querySelector(selector);};
var $$ = function $$(selector) {return document.querySelectorAll(selector);};var


Zoetrope = function () {
	function Zoetrope(container) {_classCallCheck(this, Zoetrope);
		this.container = $(container);
		this.tileWidth = 150;
		this.fullRotation = 360;
		this.tileArray = [];
		this.slotDraggable = null;
		this.triggerState = true;
		this.tilesNum = 18;
		this.tileMargin = 0;
	}_createClass(Zoetrope, [{ key: 'init', value: function init()

		{
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
		} }, { key: 'setupHTML', value: function setupHTML()

		{
			TweenLite.set(this.container, {
				transform: 'rotateX(-12deg)',
				transformStyle: 'preserve-3d',
				height: '100vh' });


			this.el = document.createElement('ul');
			this.el.className = 'zoetrope';
			this.container.appendChild(this.el);
		} }, { key: 'setupNullObj', value: function setupNullObj()

		{
			this.nullObject = document.createElement('div');
			this.nullObject.className = 'null-object';
			$('body').appendChild(this.nullObject);

			TweenLite.set(this.nullObject, {
				position: 'absolute',
				x: 0 });

		}

		// listen() {
		// console.log('zoetrope:listening');
		// $('#slot-trigger').addEventListener('click', this.handleClick);
		// EVT.on('modalClose', Slot.enable);
		// EVT.on('slotComplete', Slot.disable);
		// }
	}, { key: 'createTiles', value: function createTiles()
		{
			var self = this;
			for (var i = 0; i < this.tilesNum; i++) {
				var tile = document.createElement('li');
				var fileNumber = i < 10 ? '0' + i : i;
				var itemBack = document.createElement('div');

				console.log(fileNumber);
				itemBack.className = "item-back";
				itemBack.style.backgroundImage = 'url(./images/file00' + fileNumber + '.jpg)';
				// '<div class="item-back"></div>';

				tile.className = 'item';
				tile.innerHTML = '<div class="item-front">' + i + '</div>';

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
					transform: 'rotateY(' + i * self.rotationStep + 'deg) translateZ(' + self.zDepth + 'px)' });


				self.tileArray.push(tile);
				self.el.appendChild(tile);
			}
		} }, { key: 'setDraggable', value: function setDraggable()

		{
			var self = this;
			this.slotDraggable = Draggable.create(this.nullObject, {
				type: 'x',
				lockAxis: true,
				trigger: this.container,
				dragResistance: 0.5,
				throwResistance: 1200,
				minDuration: 4,
				throwProps: true,
				zIndexBoost: true,
				onDrag: function onDrag() {return self.onUpdate.call(self);},
				// onDragEnd: self.onInteractionEnd,
				onThrowUpdate: function onThrowUpdate() {return self.onUpdate.call(self);}
				// onThrowComplete: self.onComplete
				// ease: Back.easeOut.config(0.2)
			});
		} }, { key: 'handleClick', value: function handleClick()

		{
			if (!this.triggerState) {return;}

			var yPos = Math.floor(Math.random() * (Math.floor(2000) - Math.ceil(-2000))) + -2000;
			var endValue = Math.round(yPos / this.rotationStep) * this.rotationStep;

			// this.setActiveTile(endValue);

			TweenLite.to(this.nullObject, 2, {
				y: endValue,
				onUpdate: this.onUpdate,
				// onComplete: this.onComplete,
				ease: Back.easeOut.config(0.2) });

		} }, { key: 'onUpdate', value: function onUpdate()

		{
			var destX = this.nullObject._gsTransform.x % this.fullRotation;
			var velocity = ThrowPropsPlugin.getVelocity(this.nullObject, 'y');
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
				rotationY: destX });

		}

		// onComplete() {
		// EVT.emit('slotComplete', Slot.activeTile);
		// setTimeout(function() {
		// 	EVT.emit('highlightTile', this.activeTile);
		// }, 400);
		// }
	}, { key: 'disable', value: function disable()
		{
			this.triggerState = false;
			this.slotDraggable[0].disable();
		} }, { key: 'enable', value: function enable()

		{
			this.triggerState = true;
			this.slotDraggable[0].enable();
		} }, { key: 'getZDepth', value: function getZDepth(

		tileWidth, tilesNum) {
			return tileWidth / (2 * Math.tan(Math.PI / tilesNum));
		} }, { key: 'getZOrigin', value: function getZOrigin()

		{
			return Math.round(window.innerWidth / 2 / Math.tan(this.DegreesToRadians(this.rotationStep / 2)));
		} }, { key: 'DegreesToRadians', value: function DegreesToRadians(

		valDeg) {
			return 2 * Math.PI / this.fullRotation * valDeg;
		} }, { key: 'getPerspective', value: function getPerspective()

		{
			return this.rotationStep / this.fullRotation * 2500;
		} }]);return Zoetrope;}();
'use strict';var zoetrope = new Zoetrope('.container');

zoetrope.init();