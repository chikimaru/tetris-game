# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Tetris game project (テトリス４) implemented as a web-based game using HTML5 Canvas and vanilla JavaScript. The game features classic Tetris gameplay with all standard tetromino pieces, line clearing, scoring, and level progression.

## Development Commands

Since this is a simple web-based game, no build tools are required. To run the game:

1. Open `index.html` in a web browser
2. Or serve the files using a local web server:
   ```bash
   # Using Python (if available)
   python -m http.server 8000

   # Using Node.js (if available)
   npx serve .
   ```

## Architecture

### File Structure
- `index.html` - Main HTML file with game UI and canvas elements
- `tetris.js` - Complete game implementation in a single JavaScript file
- `CLAUDE.md` - This documentation file

### Game Components

**TetrisGame Class** (`tetris.js`)
- Main game controller that manages all game state and logic
- Handles piece movement, rotation, collision detection
- Manages game board (10x20 grid), scoring, and level progression
- Implements the main game loop using `requestAnimationFrame`

**Key Methods:**
- `spawnNewPiece()` - Creates new tetromino pieces
- `movePiece(dx, dy)` - Handles piece movement with collision detection
- `rotatePiece()` - Rotates current piece using matrix transformation
- `placePiece()` - Places piece on board and triggers line clearing
- `clearLines()` - Removes completed lines and updates score
- `draw()` - Renders the game state to canvas

**Game Features:**
- 7 classic tetromino shapes (I, O, T, S, Z, J, L)
- Full keyboard controls (arrow keys, space for hard drop, P for pause)
- Next piece preview
- Score, level, and line tracking
- Increasing fall speed with level progression
- Game over detection and restart functionality

### Controls
- ← → : Move piece left/right
- ↓ : Soft drop (faster falling)
- ↑ : Rotate piece clockwise
- Space: Hard drop (instant drop)
- P: Pause/unpause game

### Scoring System
- 1 point per soft drop
- 2 points per hard drop line
- Line clears: 100/300/500/800 points for 1/2/3/4 lines × current level
- Level increases every 10 lines cleared
- Fall speed increases with level