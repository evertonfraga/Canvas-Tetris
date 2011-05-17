var BLOCK_SIZE = 20;
var GAMESPEED = 600;
var GAMELOOP = null;
var ACTIVE_PIECE = null;
var canvas = document.querySelectorAll('canvas')[0];
var c = canvas.getContext('2d');
var ORIENTATION = {
	NORTH: 0,
	WEST: 1,
	SOUTH: 2,
	EAST: 3
};
var KEYS = {
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	DOWN: 40,
	ACTION1: 32,
	PAUSE: 80
};

function Piece(op) {
	var self = this;
	this.blocks = [];
	this.x = 0;
	this.y = 0;
	this.active = false;
	
	this.move = function (coords) {
		clearArea(self, c);
		coords.x = coords.x || 0;
		coords.y = coords.y || 0;
		this.x += coords.x;
		this.y += coords.y;
		drawPiece(self);
	};
}

function clearArea (piece, cx) {
	var STROKE = 2;
	for (i in piece.blocks){
		var x = (piece.x + piece.blocks[i].x) * BLOCK_SIZE;
		var y = (piece.y + piece.blocks[i].y) * BLOCK_SIZE;
		cx.clearRect(x-STROKE, y-STROKE, BLOCK_SIZE+STROKE*2, BLOCK_SIZE + STROKE * 2);
	}
}

function drawPiece (piece) {
	for (i in piece.blocks){
		piece.blocks[i].color = piece.color;
		piece.blocks[i].offsetX = piece.x;
		piece.blocks[i].offsetY = piece.y;
		if (piece.active)
			piece.blocks[i].stroke = '#0f0';
		drawBlock(piece.blocks[i], c);
	}
}

function drawBlock (op, cx) {
	var x = (op.offsetX + op.x) * BLOCK_SIZE;
	var y = (op.offsetY + op.y) * BLOCK_SIZE;
	op.stroke = op.stroke || '#000';
	//bloco
	cx.beginPath();
	cx.fillStyle = op.color;
	cx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
	
	//contorno
	cx.strokeStyle = op.stroke;
	cx.lineWidth = 2;
	cx.beginPath();
	cx.moveTo(x, y);
	cx.lineTo(x + BLOCK_SIZE, y);
	cx.lineTo(x + BLOCK_SIZE, y + BLOCK_SIZE);
	cx.lineTo(x, y + BLOCK_SIZE);
	cx.closePath();
	cx.stroke();
	
	//reflexo
	cx.beginPath();
	cx.fillStyle = 'rgba(255, 255, 255, 0.4)';
	cx.moveTo(x, y);
	cx.lineTo(x + BLOCK_SIZE, y);
	cx.lineTo(x, y + BLOCK_SIZE);
	cx.fill();
}


var p1 = new Piece();
p1.blocks = [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}, {x: 1, y: 2}];
p1.color = '#f00';
p1.active = true;


var p2 = new Piece();
p2.blocks = [{x: 0, y: 1}, {x: 0, y: 2}, {x: 0, y: 3}, {x: 0, y: 4}];
p2.color = '#00f';
p2.x = 6;
p2.y = 2;

var p3 = new Piece();
p3.blocks = [{x: 0, y: 1}, {x: 1, y: 0}, {x: 1, y: 1}, {x: 2, y: 1}];
p3.color = '#ff0';
p3.x = 8;
p3.y = 8;

drawPiece(p1);
drawPiece(p2);
drawPiece(p3);
ACTIVE_PIECE = p1;

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
		case KEYS.PAUSE:
	}
};

// game loop
function loop () {
	// console.log(ACTIVE_PIECE.y);
	if (ACTIVE_PIECE.y) {}
	ACTIVE_PIECE.move({y: +1});
}
GAMELOOP = window.setInterval(loop, GAMESPEED);