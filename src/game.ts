
import { Board, parseMove } from './board';
import { Color } from './piece';
import readline from 'node:readline';

export class Game {
  board: Board;
  turn: Color;

  constructor() {
    this.board = new Board();
    this.turn = 'white';
  }

  print() {
    console.log(this.board.toString());
  }

  runCLI() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const ask = () => {
      this.print();
      rl.question(`${this.turn[0].toUpperCase() + this.turn.slice(1)} to move. Enter move (e.g., "b2,b3" or "2,2 3,2") or "q": `, (line) => {
        if (line.trim().toLowerCase() === 'q') { rl.close(); return; }
        const parsed = parseMove(line);
        if (!parsed) {
          console.log('Invalid input. Use "b2,b3" or "2,2 3,2"');
          return ask();
        }
        const { from, to } = parsed;
        const piece = this.board.at(from);
        if (!piece) {
          console.log('No piece at start square.');
          return ask();
        }
        if (piece.color !== this.turn) {
          console.log(`It's ${this.turn}'s turn.`);
          return ask();
        }
        const res = this.board.move(from, to);
        if (!res.ok) {
          console.log(`Move rejected: ${res.message}`);
          return ask();
        }
        if (res.capturedKing) {
          this.print();
          console.log(`${this.turn} wins by capturing the king!`);
          rl.close();
          return;
        }
        this.turn = this.turn === 'white' ? 'black' : 'white';
        ask();
      });
    };
    ask();
  }
}
