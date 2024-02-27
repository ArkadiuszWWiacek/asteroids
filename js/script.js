const SCREEN_LOG = document.querySelector('#screen-log');
const LINE_LOG = document.querySelector('#line-log');
let canvasAW;
let ctxAW;
let starship;
let cRect;
let shots = [];
let asteroids = [];
let asteroid;

let myGamePiece;
let canvasOffset = [];
let backgroundLayers = [];

function startGame() {
	myGameArea.start();
	backgroundLayers.push(new Background(40, 0.1, 1));
	backgroundLayers[0].start();
	backgroundLayers.push(new Background(30, 1, 1.5));
	backgroundLayers[1].start();
	backgroundLayers.push(new Background(20, 2, 5));
	backgroundLayers[2].start();
	myGamePiece = new Starship();
	for (let i = 0; i < 5; i++) {
		asteroids.push(new Asteroid(5, -30, 30, -30, 30));
		asteroids[i].start();
	}
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
	backgroundLayers[1].speedX = 0;
	backgroundLayers[1].speedY = 0;
	backgroundLayers[2].speedX = 0;
	backgroundLayers[2].speedY = 0;
	if (myGameArea.keys && (myGameArea.keys[37] || myGameArea.keys[65])) {
		myGamePiece.speedX = -2;
		backgroundLayers[1].speedX = 0.1;
		backgroundLayers[2].speedX = 0.3;
	}
	if (myGameArea.keys && (myGameArea.keys[39] || myGameArea.keys[68])) {
		myGamePiece.speedX = 2;
		backgroundLayers[1].speedX = -0.1;
		backgroundLayers[2].speedX = -0.3;
	}
	if (myGameArea.keys && (myGameArea.keys[38] || myGameArea.keys[87])) {
		myGamePiece.speedY = -2;
		backgroundLayers[1].speedY = 0.1;
		backgroundLayers[2].speedY = 0.3;
	}
	if (myGameArea.keys && (myGameArea.keys[40] || myGameArea.keys[83])) {
		myGamePiece.speedY = 2;
		backgroundLayers[1].speedY = -0.1;
		backgroundLayers[2].speedY = -0.3;
	}

	backgroundLayers[0].update();
	backgroundLayers[1].newPos();
	backgroundLayers[1].update();
	backgroundLayers[2].newPos();
	backgroundLayers[2].update();

	myGamePiece.newPos();
	myGamePiece.update();
	// asteroids = asteroids.filter(asteroid => asteroid);
	asteroids.forEach(function (a, index) {
		if (a.toBeRemoved) {
			asteroids.splice(index, 1);
		}
	});
	if (asteroids.length < 5) {
		let asteroid = new Asteroid(5, -30, 30, -30, 30);
		asteroid.start();
		asteroids.push(asteroid);
	}
	asteroids.forEach(function (s) {
		s.update();
	});
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

function Asteroid(numVertices, minX, maxX, minY, maxY) {
	this.positionX = 0;
	this.positionY = 0;
	this.color = 'grey';
	this.width = 20;
	this.height = 20;
	this.directionX;
	this.directionY;
	this.rotationSpeed = 15;
	this.angle = 0;
	this.translationX = 0;
	this.translationY = 0;
	this.speed = 0;
	this.numVertices = numVertices;
	this.minX = minX;
	this.maxX = maxX;
	this.minY = minY;
	this.maxY = maxY;
	this.vertices = this.generateRandomVertices();
	this.toBeRemoved = false;
}
Asteroid.prototype = {
	waste() {
		if (this.translationX > 860 || this.translationX < -60 || this.translationY > 660 || this.translationY < -60) {
			this.toBeRemoved = true;
		}
	},
	randomNumber(minValue, maxValue) {
		return Math.random() * (maxValue - minValue) + minValue;
	},
	generateRandomStartPosition() {
		let x;
		do {
			x = this.randomNumber(-50, 850);
		} while (x > 0 && x < 800);
		let y;
		do {
			y = this.randomNumber(-50, 650);
		} while (y > 0 && y < 600);
		if (x < 0) this.directionX = this.randomNumber(0.1, 2);
		else this.directionX = -this.randomNumber(0.1, 2);
		if (y < 0) this.directionY = this.randomNumber(0.1, 2);
		else this.directionY = -this.randomNumber(0.1, 2);
		return [x, y];
	},
	get rotation() {
		if (this.angle >= 360) {
			this.angle = 0 + (this.angle - 360);
		}
		return this.angle * (Math.PI / 180);
	},
	// Funkcja pomocnicza do sprawdzania czy dwie krawędzie się przecinają
	intersect(a, b, c, d) {
		function ccw(a, b, c) {
			return (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
		}
		return ccw(a, c, d) !== ccw(b, c, d) && ccw(a, b, c) !== ccw(a, b, d);
	},
	// Generowanie losowych współrzędnych dla wierzchołków
	generateRandomVertices() {
		let vertices = [];
		// Losowanie współrzędnych dla każdego wierzchołka
		for (let i = 0; i < this.numVertices; i++) {
			vertices.push({
				x: Math.random() * (this.maxX - this.minX) + this.minX,
				y: Math.random() * (this.maxY - this.minY) + this.minY,
			});
		}
		// Sprawdzenie, czy wygenerowany wielokąt jest poprawny (nie przecina się)
		for (let i = 0; i < vertices.length; i++) {
			const a = vertices[i];
			const b = vertices[(i + 1) % vertices.length];
			for (let j = i + 1; j < vertices.length; j++) {
				const c = vertices[j];
				const d = vertices[(j + 1) % vertices.length];
				if (this.intersect(a, b, c, d)) {
					// Jeśli krawędzie się przecinają, generuj nowe współrzędne
					return this.generateRandomVertices();
				}
			}
		}

		return vertices;
	},
	draw() {
		ctxAW.fillStyle = this.color;
		ctxAW.save();
		ctxAW.translate(this.translationX, this.translationY);
		ctxAW.rotate(this.rotation);
		ctxAW.beginPath();
		ctxAW.moveTo(this.vertices[0].x, this.vertices[0].y);
		for (let i = 1; i < this.vertices.length; i++) {
			ctxAW.lineTo(this.vertices[i].x, this.vertices[i].y);
		}
		ctxAW.closePath();
		ctxAW.fill();
		ctxAW.restore();
	},
	start() {
		this.translationX = this.generateRandomStartPosition()[0];
		this.translationY = this.generateRandomStartPosition()[1];
	},
	update() {
		ctxAW = myGameArea.context;
		this.translationX += this.directionX;
		this.translationY += this.directionY;
		// console.log(this.angle);
		this.angle += 1;
		this.draw();
		this.waste();
	},
};

function Background(numberOfObjects, minR, maxR) {
	this.numberOfObjects = numberOfObjects;
	this.minRadius = minR;
	this.maxRadius = maxR;
	this.translationX = 0;
	this.translationY = 0;
	this.backgroundObjects = [];
	this.speedX = 0;
	this.speedY = 0;
	this.color = 'white';
}
Background.prototype = {
	randomNumber(minValue, maxValue) {
		return Math.random() * (maxValue - minValue) + minValue;
	},
	generateBackgroundObjects() {
		for (let i = 0; i < this.numberOfObjects; i++) {
			let temp = [];
			temp.push(this.randomNumber(-50, 850));
			temp.push(this.randomNumber(-50, 650));
			temp.push(this.randomNumber(this.minRadius, this.maxRadius));
			temp.push(`rgba(255, 255, 255, ${this.randomNumber(0.1, 1)}`);
			this.backgroundObjects.push(temp);
		}
	},
	drawBackground() {
		// ctxAW = myGameArea.context;
		// ctxAW.fillStyle = 'white';
		// ctxAW.save();
		// ctxAW.translate(this.translationX, this.translationY);
		// ctxAW.beginPath();
		// ctxAW.arc(this.backgroundObjects[0][0], this.backgroundObjects[0][1], this.backgroundObjects[0][2], 0, Math.PI * 2);
		// ctxAW.closePath();
		// ctxAW.fill();
		// ctxAW.restore();
		for (let i of this.backgroundObjects) {
			ctxAW = myGameArea.context;
			ctxAW.fillStyle = i[3];
			ctxAW.save();
			ctxAW.translate(this.translationX, this.translationY);
			ctxAW.beginPath();
			ctxAW.arc(i[0], i[1], i[2], 0, Math.PI * 2);
			ctxAW.closePath();
			ctxAW.fill();
			ctxAW.restore();
		}
	},
	start() {
		this.generateBackgroundObjects();
		this.drawBackground();
	},
	newPos() {
		this.translationX += this.speedX;
		this.translationY += this.speedY;
	},
	update() {
		// console.log(this.speedX);
		// console.log(this.speedY);
		ctxAW = myGameArea.context;
		this.drawBackground();
	},
};
