
import { Board } from '../src/board';
import { PieceType } from '../src/piece';

test('board initialization has correct major pieces', () => {
  const b = new Board();
  expect(b.at({r:7, c:0})?.type).toBe(PieceType.Rook);
  expect(b.at({r:7, c:4})?.type).toBe(PieceType.King);
  expect(b.at({r:0, c:3})?.type).toBe(PieceType.Queen);
  expect(b.at({r:6, c:0})?.type).toBe(PieceType.Pawn);
  expect(b.at({r:1, c:7})?.type).toBe(PieceType.Pawn);
});
