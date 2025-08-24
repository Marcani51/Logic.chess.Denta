"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("../src/board");
function mv(b, from, to) {
    const f = (0, board_1.coordFromAlgebraic)(from);
    const t = (0, board_1.coordFromAlgebraic)(to);
    return b.move(f, t);
}
test('pawn forward and capture', () => {
    const b = new board_1.Board();
    // white pawn e2 to e4
    expect(mv(b, 'e2', 'e4').ok).toBe(true);
    // black pawn d7 to d5
    expect(mv(b, 'd7', 'd5').ok).toBe(true);
    // white pawn e4 to d5 capture
    expect(mv(b, 'e4', 'd5').ok).toBe(true);
});
test('knight jump over pieces', () => {
    const b = new board_1.Board();
    expect(mv(b, 'g1', 'f3').ok).toBe(true);
    expect(mv(b, 'b8', 'c6').ok).toBe(true);
});
test('blockers prevent bishop/rook/queen', () => {
    const b = new board_1.Board();
    // Try rook a1 to a3 (blocked by pawn at a2)
    const res = mv(b, 'a1', 'a3');
    expect(res.ok).toBe(false);
});
test('win condition: capturing king', () => {
    const b = new board_1.Board();
    // Fast path to capture black king (artificial): open e-file and move queen
    mv(b, 'e2', 'e4'); // white pawn
    mv(b, 'a7', 'a5'); // black pawn
    mv(b, 'd1', 'h5'); // white queen
    mv(b, 'a8', 'a6'); // black rook
    const res = mv(b, 'h5', 'e8'); // capture black king on e8
    expect(res.ok).toBe(true);
    expect(res.capturedKing).toBe(true);
});
