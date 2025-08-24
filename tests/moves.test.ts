
import { Board, coordFromAlgebraic } from '../src/board';

function mv(b: Board, from: string, to: string) {
  const f = coordFromAlgebraic(from)!;
  const t = coordFromAlgebraic(to)!;
  return b.move(f, t);
}

test('pawn forward and capture', () => {
  const b = new Board();

  expect(mv(b,'e2','e4').ok).toBe(true);
  expect(mv(b,'d7','d5').ok).toBe(true);
  expect(mv(b,'e4','d5').ok).toBe(true);
});

test('knight jump over pieces', () => {
  const b = new Board();

  expect(mv(b,'g1','f3').ok).toBe(true);
  expect(mv(b,'b8','c6').ok).toBe(true);
});

test('blockers prevent bishop/rook/queen', () => {
  const b = new Board();

  const res = mv(b,'a1','a3');
  expect(res.ok).toBe(false);
});

test('win condition: capturing king', () => {
  const b = new Board();
  
  mv(b,'e2','e4'); 
  mv(b,'a7','a5'); 
  mv(b,'d1','h5'); 
  mv(b,'a8','a6');
  const res = mv(b,'h5','e8');
  expect(res.ok).toBe(true);
  expect(res.capturedKing).toBe(true);
});
