# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2025-09-24

### Added
- Click-to-pause functionality: Players can now click on the game canvas to pause/unpause the game

### Changed
- Disabled P key for pause functionality - pause is now only available via mouse click on game canvas

### Technical Details
- Added click event listener to game canvas in `bindEvents()` method
- Removed P key handling from keyboard event switch statement
- Maintained existing game controls (arrow keys for movement/rotation, space for hard drop)

## [1.0.0] - Initial Release

### Features
- Complete Tetris gameplay with all 7 standard tetromino pieces (I, O, T, S, Z, J, L)
- Rich glassmorphism UI design with gradient backgrounds and glow effects
- Smooth animations and visual feedback
- Progressive difficulty with increasing speed and level progression
- Next piece preview in 5×5 grid
- Comprehensive scoring system (soft drops, hard drops, line clears)
- Full keyboard controls with intuitive key mappings
- Responsive design for desktop and mobile devices
- Game over detection and restart functionality