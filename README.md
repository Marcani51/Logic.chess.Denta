
# Chess CLI (TypeScript)

- Console-based chess game
- Created by: Marcellus Denta

## Features

- 8x8 board with standard initial setup
- Print board after each move
- Input formats: `1,3 2,3` **or** `b2,b3`
- Move validation for King, Queen, Rook, Bishop, Knight, Pawn (basic chess rules)
- Win condition: game ends when a **king is captured**
- Unit tests (Jest)

## Requirements

- Node.js >= 18
- npm

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

You'll see the board and be prompted like:

```
White to move. Enter move (e.g., "b2,b3" or "2,2 3,2") or "q" to quit:
```

## Test

```bash
npm test
```
