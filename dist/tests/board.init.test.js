"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_js_1 = require("../src/board.js");
const piece_js_1 = require("../src/piece.js");
test('board initialization has correct major pieces', () => {
    const b = new board_js_1.Board();
    expect(b.at({ r: 7, c: 0 })?.type).toBe(piece_js_1.PieceType.Rook);
    expect(b.at({ r: 7, c: 4 })?.type).toBe(piece_js_1.PieceType.King);
    expect(b.at({ r: 0, c: 3 })?.type).toBe(piece_js_1.PieceType.Queen);
    expect(b.at({ r: 6, c: 0 })?.type).toBe(piece_js_1.PieceType.Pawn);
    expect(b.at({ r: 1, c: 7 })?.type).toBe(piece_js_1.PieceType.Pawn);
});
