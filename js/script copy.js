const SCREEN_LOG = document.querySelector('#screen-log');
const LINE_LOG = document.querySelector('#line-log');
let canvasAW;
let ctxAW;
let starship;
let cRect;

function startAppAW() {
	startCanvasAW();
	starship = new Starship();
	starship.drawStarship();

	let canvasCenterX = canvasAW.width / 2;
	let canvasCenterY = canvasAW.height / 2;

	// Dodaj nasłuchiwanie zdarzenia ruchu myszką

	// document.addEventListener('mousemove', function (event) {
	// 	let mouseX = event.clientX - canvasAW.getBoundingClientRect().left;
	// 	let mouseY = event.clientY - canvasAW.getBoundingClientRect().top;

	// 	let angle = Math.atan2(mouseY - canvasCenterY, mouseX - canvasCenterX);

	// 	ctxAW.clearRect(0, 0, canvasAW.width, canvasAW.height);
	// 	ctxAW.save();
	// 	ctxAW.translate(canvasAW.width / 2, canvasAW.height / 2);
	// 	ctxAW.rotate(angle);
	// 	starship.drawStarship();
	// 	ctxAW.restore();
	// });
	document.addEventListener('mousemove', function (event) {
		let mouseX = event.clientX - canvasAW.getBoundingClientRect().left;
		let mouseY = event.clientY - canvasAW.getBoundingClientRect().top;
		let angle = Math.atan2(mouseY - canvasCenterY, mouseX - canvasCenterX);
		clearCanvas();
		starship.angle = angle;
		starship.rotateShip();
	});

}

function clearCanvas() {
	ctxAW.clearRect(0, 0, canvasAW.width, canvasAW.height);
}

function startCanvasAW() {
	canvasAW = document.querySelector('#myCanvas');
	ctxAW = canvasAW.getContext('2d');
}

function Starship() {
	this.size = 20;
	this.positionX = 0;
	this.positionY = 0;
	this.color = 'black';
	this.width = 14;
	this.height = 20;
	this.directionX;
	this.directionY;
	this.angle;
	this.translationX = 400;
	this.translationY = 300;
}

Starship.prototype = {
	get shipDirection() {
		return Math.atan2(this.directionX, this.directionY);
	},
	get positions() {
		return [this.positionX, this.positionY];
	},
	drawStarship() {
		ctxAW.strokeStyle = this.color;
		ctxAW.fillStyle = this.color;
		ctxAW.beginPath();
		ctxAW.moveTo(this.positionX - 10, this.positionY + 7);
		ctxAW.lineTo(this.positionX + 10, this.positionY);
		ctxAW.lineTo(this.positionX - 10, this.positionY - 7);
		ctxAW.closePath();
		ctxAW.fill();
		ctxAW.stroke();
		// ctxAW.textAlign = 'center';
		// ctxAW.fillText(`${this.positionX}, ${this.positionY}`, this.positionX, this.positionY - 20);
	},
	rotateShip() {
		ctxAW.save();
		// ctxAW.translate(canvasAW.width / 2, canvasAW.height / 2);
		ctxAW.translate(this.translationX, this.translationY);
		ctxAW.rotate(this.angle);
		this.drawStarship();
		ctxAW.restore();
	},
};

document.addEventListener('mousemove', logKey);

function logKey(e) {
	let cRect = canvasAW.getBoundingClientRect(); // Gets CSS pos, and width/height
	// let canvasX = Math.round(e.clientX - cRect.left); // Subtract the 'left' of the canvas
	// let canvasY = Math.round(e.clientY - cRect.top); // from the X/Y positions to make
	// SCREEN_LOG.innerText = `
	// Canva X/Y: ${canvasX}, ${canvasY}`;
	// console.log(Math.round(e.clientX));
	// console.log(canvasY);
	// starship.directionX = canvasX;
	// starship.directionY = canvasY;
	// 	return [canvasX, canvasY];
}
