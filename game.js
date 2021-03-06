var STAGE_DIMENSIONS = {width: 15, height: 20};
var BLOCK_SIZE = 20;
var GAME_SPEED = 600;
var GAME_LOOP = null;
var ACTIVE_PIECE = null;
var canvas = document.querySelectorAll('canvas')[0];
var c = canvas.getContext('2d');
var KEYS = {
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	ACTION1: 32,
	PAUSE: 80,
	NEW: 78,
	RESTART: 82
};

var PIECES = [
	// L
	{color: '#f00', blocks: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}]},
	// J
	{color: '#ff0', blocks: [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}, {x: 0, y: 2}]},
	// ----
	{color: '#00f', blocks: [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}]},
	// |-
	{color: '#a0f', blocks: [{x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}]},
	// square
	{color: '#0b0', blocks: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 0, y: 1}]},
	// _=-
	{color: '#f0f', blocks: [{x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 0}]},
	// -=_
	{color: '#f70', blocks: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}]}
];




function Piece(op) {
	var self = this;
	this.blocks = op && op.blocks;
	this.color = op && op.color;
	this.x = 0;
	this.y = 0;
	this.active = false;
	
	this.move = function (moveTo) {
		// console.log('leftMost: ' + this.leftMost(), 'rightMost: ' + this.rightMost());
		if (moveTo.x < 0 && this.x + this.leftMost() == 0){
			return this;
		}
		if (moveTo.x > 0 && this.x + this.rightMost() == STAGE_DIMENSIONS.width - 1){
			return this;
		}
		moveTo.x = moveTo.x || 0;
		moveTo.y = moveTo.y || 0;
		clearArea(self, c);
		this.x += moveTo.x;
		this.y += moveTo.y;
		drawPiece(self);
		return this;
	};
	
	this.leftMost = function () {
		var min = null;
		for (i in this.blocks){
			if (this.blocks[i].x < min) { min = this.blocks[i].x; }
		}
		return this.x + min;
	};
	
	this.rightMost = function () {
		var max = null;
		for (i in this.blocks){
			if (this.blocks[i].x > max) { max = this.blocks[i].x; }
		}
		return this.x + max;
	};
	
	this.rotate = function (orientation) {
		return this;
	};
}

function clearArea (piece, cx) {
	for (i in piece.blocks){
		var x = (piece.x + piece.blocks[i].x) * BLOCK_SIZE;
		var y = (piece.y + piece.blocks[i].y) * BLOCK_SIZE;
		cx.clearRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
	}
}

function drawPiece (piece) {
	for (i in piece.blocks){
		piece.blocks[i].color = piece.color;
		piece.blocks[i].offsetX = piece.x;
		piece.blocks[i].offsetY = piece.y;
		drawBlock(piece.blocks[i], c);
	}
}

function drawBlock (op, cx) {
	var x = (op.offsetX + op.x) * BLOCK_SIZE;
	var y = (op.offsetY + op.y) * BLOCK_SIZE;
	//block
	cx.beginPath();
	cx.fillStyle = op.color;
	cx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
	
	//reflection
	cx.beginPath();
	cx.fillStyle = 'rgba(255, 255, 255, 0.4)';
	cx.moveTo(x, y);
	cx.lineTo(x + BLOCK_SIZE, y);
	cx.lineTo(x, y + BLOCK_SIZE);
	cx.fill();
	
	//shadow
	cx.beginPath();
	cx.fillStyle = 'rgba(0, 0, 0, 0.1)';
	cx.moveTo(x + BLOCK_SIZE, y);
	cx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE);
	cx.lineTo(x, y + BLOCK_SIZE);
	cx.fill();
	
	// middle
	cx.fillStyle = op.color;
	cx.fillRect(x + BLOCK_SIZE/4, y + BLOCK_SIZE/4, BLOCK_SIZE/2, BLOCK_SIZE/2);
}

function spawnPiece () {
	var randomPiece = Math.floor(Math.random() * PIECES.length);
	var newPiece = new Piece( PIECES[randomPiece] );
	newPiece.x = 5;
	newPiece.y = 0;
	return newPiece;
}

ACTIVE_PIECE = spawnPiece();

window.onkeydown = function(evt) {
	// console.log(evt.which);
	switch(evt.which){
		case KEYS.LEFT:
			evt.preventDefault();
			ACTIVE_PIECE.move({x: -1});
			break;
		case KEYS.RIGHT:
			evt.preventDefault();
			ACTIVE_PIECE.move({x: +1});
			break;
		case KEYS.DOWN:
			evt.preventDefault();
			ACTIVE_PIECE.move({y: +1});
			break;
		case KEYS.PAUSE:
			evt.preventDefault();
			window.clearInterval(GAME_LOOP);
			break;
		case KEYS.NEW:
			ACTIVE_PIECE = spawnPiece();
			break;
		// case KEYS.RESET:
	}
};

// game loop
function loop () {
	ACTIVE_PIECE.move({y: +1});
}
GAME_LOOP = window.setInterval(loop, GAME_SPEED);