class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');

        this.BOARD_WIDTH = 10;
        this.BOARD_HEIGHT = 20;
        this.CELL_SIZE = 30;

        this.board = Array(this.BOARD_HEIGHT).fill().map(() => Array(this.BOARD_WIDTH).fill(0));

        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.isGameOver = false;
        this.isPaused = false;

        this.dropTimer = 0;
        this.dropInterval = 1000;

        this.currentPiece = null;
        this.nextPiece = null;

        this.colors = [
            '#000000',
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
            '#FFA500'
        ];

        this.initGame();
        this.bindEvents();
        this.gameLoop();
    }

    initGame() {
        this.generateNextPiece();
        this.spawnNewPiece();
        this.updateUI();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (this.isGameOver || this.isPaused) {
                if (e.code === 'KeyP') this.togglePause();
                return;
            }

            switch (e.code) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case 'Space':
                    this.hardDrop();
                    break;
                case 'KeyP':
                    this.togglePause();
                    break;
            }
        });
    }

    generateNextPiece() {
        const pieces = [
            { shape: [[1,1,1,1]], color: 1 }, // I
            { shape: [[2,2],[2,2]], color: 2 }, // O
            { shape: [[0,3,0],[3,3,3]], color: 3 }, // T
            { shape: [[0,4,4],[4,4,0]], color: 4 }, // S
            { shape: [[5,5,0],[0,5,5]], color: 5 }, // Z
            { shape: [[6,0,0],[6,6,6]], color: 6 }, // J
            { shape: [[0,0,7],[7,7,7]], color: 7 }  // L
        ];

        const randomIndex = Math.floor(Math.random() * pieces.length);
        this.nextPiece = {
            shape: pieces[randomIndex].shape,
            color: pieces[randomIndex].color,
            x: Math.floor(this.BOARD_WIDTH / 2) - Math.floor(pieces[randomIndex].shape[0].length / 2),
            y: 0
        };
    }

    spawnNewPiece() {
        if (this.nextPiece) {
            this.currentPiece = { ...this.nextPiece };
            this.currentPiece.shape = this.nextPiece.shape.map(row => [...row]);
        }

        this.generateNextPiece();

        if (this.isCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver();
        }
    }

    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;

        if (!this.isCollision(newX, newY, this.currentPiece.shape)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }

    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (!this.isCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
        }
    }

    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }

        return rotated;
    }

    hardDrop() {
        while (this.movePiece(0, 1)) {
            this.score += 2;
        }
        this.placePiece();
    }

    isCollision(x, y, shape) {
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[i].length; j++) {
                if (shape[i][j] !== 0) {
                    const newX = x + j;
                    const newY = y + i;

                    if (newX < 0 || newX >= this.BOARD_WIDTH ||
                        newY >= this.BOARD_HEIGHT ||
                        (newY >= 0 && this.board[newY][newX] !== 0)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    placePiece() {
        for (let i = 0; i < this.currentPiece.shape.length; i++) {
            for (let j = 0; j < this.currentPiece.shape[i].length; j++) {
                if (this.currentPiece.shape[i][j] !== 0) {
                    const x = this.currentPiece.x + j;
                    const y = this.currentPiece.y + i;
                    if (y >= 0) {
                        this.board[y][x] = this.currentPiece.color;
                    }
                }
            }
        }

        this.clearLines();
        this.spawnNewPiece();
    }

    clearLines() {
        let linesCleared = 0;

        for (let y = this.BOARD_HEIGHT - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.BOARD_WIDTH).fill(0));
                linesCleared++;
                y++;
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 100);

            const lineScores = [0, 100, 300, 500, 800];
            this.score += lineScores[linesCleared] * this.level;
        }
    }

    gameOver() {
        this.isGameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }

    draw() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBoard();
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece, this.ctx);
        }
        this.drawNextPiece();
    }

    drawBoard() {
        for (let y = 0; y < this.BOARD_HEIGHT; y++) {
            for (let x = 0; x < this.BOARD_WIDTH; x++) {
                if (this.board[y][x] !== 0) {
                    this.ctx.fillStyle = this.colors[this.board[y][x]];
                    this.ctx.fillRect(x * this.CELL_SIZE, y * this.CELL_SIZE,
                                    this.CELL_SIZE, this.CELL_SIZE);
                    this.ctx.strokeStyle = '#FFFFFF';
                    this.ctx.strokeRect(x * this.CELL_SIZE, y * this.CELL_SIZE,
                                      this.CELL_SIZE, this.CELL_SIZE);
                }
            }
        }
    }

    drawPiece(piece, context) {
        for (let i = 0; i < piece.shape.length; i++) {
            for (let j = 0; j < piece.shape[i].length; j++) {
                if (piece.shape[i][j] !== 0) {
                    const x = (piece.x + j) * this.CELL_SIZE;
                    const y = (piece.y + i) * this.CELL_SIZE;

                    if (piece.y + i >= 0) {
                        context.fillStyle = this.colors[piece.color];
                        context.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
                        context.strokeStyle = '#FFFFFF';
                        context.strokeRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
                    }
                }
            }
        }
    }

    drawNextPiece() {
        this.nextCtx.fillStyle = '#000000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);

        if (this.nextPiece) {
            const shape = this.nextPiece.shape;
            const shapeWidth = shape[0].length;
            const shapeHeight = shape.length;

            // 5×5の枠内で中央に配置
            const offsetX = Math.floor((5 - shapeWidth) / 2);
            const offsetY = Math.floor((5 - shapeHeight) / 2);

            const tempPiece = {
                ...this.nextPiece,
                x: offsetX,
                y: offsetY
            };

            for (let i = 0; i < tempPiece.shape.length; i++) {
                for (let j = 0; j < tempPiece.shape[i].length; j++) {
                    if (tempPiece.shape[i][j] !== 0) {
                        const x = (tempPiece.x + j) * this.CELL_SIZE;
                        const y = (tempPiece.y + i) * this.CELL_SIZE;

                        this.nextCtx.fillStyle = this.colors[tempPiece.color];
                        this.nextCtx.fillRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
                        this.nextCtx.strokeStyle = '#FFFFFF';
                        this.nextCtx.strokeRect(x, y, this.CELL_SIZE, this.CELL_SIZE);
                    }
                }
            }
        }
    }

    gameLoop() {
        if (!this.isGameOver && !this.isPaused) {
            this.dropTimer += 16;

            if (this.dropTimer >= this.dropInterval) {
                if (!this.movePiece(0, 1)) {
                    this.placePiece();
                } else {
                    this.score += 1;
                }
                this.dropTimer = 0;
            }

            this.updateUI();
        }

        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    new TetrisGame();
}

let game = new TetrisGame();