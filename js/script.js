const SCREEN_LOG = document.querySelector('#screen-log');
const LINE_LOG = document.querySelector('#line-log');
let canvasAW;
let ctxAW;
let starship;
let cRect;
let shots = [];

let myGamePiece;
let canvasOffset = [];

function startGame() {
	myGameArea.start();
	myGamePiece = new Starship();
}

let myGameArea = {
	canvas: document.querySelector('#myCanvas'),
	start: function () {
		this.canvas.width = 800;
		this.canvas.height = 600;
		this.context = this.canvas.getContext('2d');
		// document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
		canvasOffset = [this.canvas.offsetLeft, this.canvas.offsetTop];
		window.addEventListener('keydown', function (e) {
			myGameArea.keys = myGameArea.keys || [];
			myGameArea.keys[e.keyCode] = true;
		});
		window.addEventListener('keyup', function (e) {
			myGameArea.keys[e.keyCode] = false;
		});
		window.addEventListener('mousemove', function (e) {
			myGamePiece.directionX = e.clientX - canvasOffset[0];
			myGamePiece.directionY = e.clientY - canvasOffset[1];
		});
		window.addEventListener('mousedown', function () {
			shots.push(myGamePiece.triggerShot());
			shots[shots.length - 1].start();
		});
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
};

function updateGameArea() {
	myGameArea.clear();
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;
	if (myGameArea.keys && (myGameArea.keys[37] || myGameArea.keys[65])) {
		myGamePiece.speedX = -2;
	}
	if (myGameArea.keys && (myGameArea.keys[39] || myGameArea.keys[68])) {
		myGamePiece.speedX = 2;
	}
	if (myGameArea.keys && (myGameArea.keys[38] || myGameArea.keys[87])) {
		myGamePiece.speedY = -2;
	}
	if (myGameArea.keys && (myGameArea.keys[40] || myGameArea.keys[83])) {
		myGamePiece.speedY = 2;
	}
	myGamePiece.newPos();
	myGamePiece.update();
	shots.forEach(function (s, index) {
		if (s.toBeRemoved) {
			delete shots[index];
		}
	});
	shots.forEach(function (s) {
		s.update();
	});
}

function Starship() {
	this.positionX = 0;
	this.positionY = 0;
	this.color = 'white';
	this.width = 14;
	this.height = 20;
	this.directionX;
	this.directionY;
	this.translationX = 400;
	this.translationY = 300;
	this.speedX = 0;
	this.speedY = 0;
}

Starship.prototype = {
	get shipDirection() {
		return Math.atan2(this.directionX, this.directionY);
	},
	get absolutePositions() {
		let absolutePositionX = this.positionX + canvasOffset[0];
		let absolutePositionY = this.positionY + canvasOffset[1];
		return [absolutePositionX, absolutePositionY];
	},
	get angle() {
		return Math.atan2(this.translationY - this.directionY, this.translationX - this.directionX) + Math.PI;
	},
	drawStarship() {
		ctxAW.strokeStyle = this.color;
		ctxAW.fillStyle = this.color;
		ctxAW.save();
		ctxAW.translate(this.translationX, this.translationY);
		ctxAW.rotate(this.angle);
		ctxAW.beginPath();
		ctxAW.moveTo(this.positionX - this.height / 2, this.positionY + this.width / 2);
		ctxAW.lineTo(this.positionX + this.height / 2, this.positionY);
		ctxAW.lineTo(this.positionX - this.height / 2, this.positionY - this.width / 2);
		ctxAW.closePath();
		ctxAW.fill();
		ctxAW.stroke();
		ctxAW.restore();
	},
	newPos() {
		this.translationX += this.speedX;
		if (this.translationX > 805) this.translationX = -5;
		if (this.translationX < -5) this.translationX = 805;
		this.translationY += this.speedY;
		if (this.translationY > 605) this.translationY = -5;
		if (this.translationY < -5) this.translationY = 605;
	},
	update() {
		ctxAW = myGameArea.context;
		this.drawStarship();
	},
	triggerShot() {
		let shot = new Shot(this.translationX, this.translationY, this.angle);
		return shot;
	},
};

function Shot(x, y, angle) {
	this.positionX = x;
	this.positionY = y;
	this.shotRange = 20;
	this.shotAngle = angle;
	this.timeout = 5000;
	this.toBeRemoved = false;
}

Shot.prototype = {
	waste() {
		if (this.positionX > 810 || this.positionX < -10 || this.positionY > 610 || this.positionY < 0) {
			this.toBeRemoved = true;
		}
	},
	set shot(newShot) {
		this.shotAngle = Number(newShot);
	},
	get shot() {
		let shotX = +this.positionX + this.shotRange * Math.cos(this.shotAngle);
		let shotY = +this.positionY + this.shotRange * Math.sin(this.shotAngle);
		return [shotX, shotY];
	},
	radians(degrees) {
		return degrees * (Math.PI / 180);
	},
	start() {
		this.draw();
	},
	draw() {
		ctxAW.strokeStyle = 'green';
		ctxAW.beginPath();
		ctxAW.moveTo(this.positionX, this.positionY);
		ctxAW.lineTo(this.shot[0], this.shot[1]);
		ctxAW.stroke();
	},
	update() {
		this.positionX = this.shot[0];
		this.positionY = this.shot[1];
		this.waste();
		this.draw();
	},
};
