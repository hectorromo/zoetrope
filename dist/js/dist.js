'use strict';var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var Zoetrope = function () {
	function Zoetrope() {_classCallCheck(this, Zoetrope);
		this.el = document.createElement('div'),
		this.el.className = 'zoetrope',
		this.container = $('.container'),
		this.tileHeight = 180,
		this.fullRotation = 360,
		this.rotationStep = this.fullRotation / this.tilesNum,
		// this.zDepth = Helpers.getZDepth(this.tileHeight, this.tilesNum),
		// this.tileZOrigin = Helpers.getZOrigin(this.rotationStep),
		// this.dynamicPerspective = Helpers.getPerspective(this.rotationStep, this.fullRotation),
		this.tileArray = [],
		this.nullObject = document.createElement('div'),
		this.nullObject.className = 'null-object',
		this.slotDraggable = null,
		this.triggerState = true;

		TweenLite.set(this.nullObject, {
			position: 'absolute',
			x: 0 });


		$('body').appendChild(this.nullObject);

		this.createTiles();
		this.setDraggable();
		this.listen();
	}_createClass(Zoetrope, [{ key: 'listen', value: function listen()

		{
			// $('#slot-trigger').addEventListener('click', this.handleClick);
			// EVT.on('modalClose', Slot.enable);
			// EVT.on('slotComplete', Slot.disable);
		} }, { key: 'createTiles', value: function createTiles()

		{
			for (var i = 0; i < 10; i++) {
				var tile = document.createElement('li');

				tile.className = 'item';
				tile.innerHTML = '<div class="item-background" style="background-color:green;"></div>\n\t\t\t\t\t\t\t\t<div class="item-content">\n\t\t\t\t\t\t\t\t\t<div class="item-image">\n\t\t\t\t\t\t\t\t\t\t<img src="" alt="">\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</div>';






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
					transform: 'rotateX(' + -(i * this.rotationStep) + 'deg) translateZ(' + this.zDepth + 'px)' });


				this.tileArray.push(tile);
				this.el.appendChild(tile);
			}
		} }, { key: 'setDraggable', value: function setDraggable()

		{
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
				snap: {
					y: function y(endValue) {
						this.setActiveTile(endValue);
						return Math.round(endValue / this.rotationStep) * this.rotationStep;
					} } });


		} }, { key: 'handleClick', value: function handleClick()

		{
			if (!this.triggerState) {return;}

			var yPos = Math.floor(Math.random() * (Math.floor(2000) - Math.ceil(-2000))) + -2000;
			var endValue = Math.round(yPos / this.rotationStep) * this.rotationStep;

			// this.setActiveTile(endValue);

			TweenLite.to(this.nullObject, 2, {
				y: endValue,
				onUpdate: this.onUpdate,
				onComplete: this.onComplete,
				ease: Back.easeOut.config(0.2) });

		} }, { key: 'onUpdate', value: function onUpdate()

		{
			var destY = this.nullObject._gsTransform.y % this.fullRotation;
			var velocity = ThrowPropsPlugin.getVelocity(this.nullObject, 'y');
			var step = Math.abs(Math.round(destY) % 30);
			var maxValue = velocity > 2800 ? 25 : 22;
			var minValue = velocity > 2500 ? 6 : 8;

			// console.log(ThrowPropsPlugin.getVelocity(Slot.nullObject, 'y'))

			// if(Slot.newStep && step > minValue && step < maxValue) {
			// 	EVT.emit('tileScrolled');
			// 	Slot.newStep = false;
			// } else if (step < minValue || step > maxValue) {
			// 	Slot.newStep = true;
			// }

			TweenLite.set(this.el, {
				rotationX: -destY,
				force3D: true });

		} }, { key: 'onComlete', value: function onComlete()

		{
			// EVT.emit('slotComplete', Slot.activeTile);
			setTimeout(function () {
				EVT.emit('highlightTile', this.activeTile);
			}, 400);
		} }, { key: 'disable', value: function disable()

		{
			this.triggerState = false;
			this.slotDraggable[0].disable();
		} }, { key: 'enable', value: function enable()

		{
			this.triggerState = true;
			this.slotDraggable[0].enable();
		} }]);return Zoetrope;}();
"use strict"; // console.log('main file')
var $ = function $(element) {return document.querySelector(element);};
var $$ = function $$(elements) {return document.querySelectorAll(elements);};

var zoetrope = new Zoetrope();