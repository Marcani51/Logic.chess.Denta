"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
exports.coordFromAlgebraic = coordFromAlgebraic;
exports.coordFromNumeric = coordFromNumeric;
exports.parseMove = parseMove;
const piece_js_1 = require("./piece.js");
class Board {
    grid;
    constructor() {
        this.grid = Array.from({ length: 8 }, () => Array(8).fill(null));
        this.init();
    }
    init() {
        // Place pieces
        const placeBackRank = (row, color) => {
            const order = [
                new piece_js_1.Rook(color), new piece_js_1.Knight(color), new piece_js_1.Bishop(color), new piece_js_1.Queen(color),
                new piece_js_1.King(color), new piece_js_1.Bishop(color), new piece_js_1.Knight(color), new piece_js_1.Rook(color)
            ];
            for (let c = 0; c < 8; c++)
                this.grid[row][c] = order[c];
        };
        placeBackRank(7, 'white');
        for (let c = 0; c < 8; c++)
            this.grid[6][c] = new piece_js_1.Pawn('white');
        placeBackRank(0, 'black');
        for (let c = 0; c < 8; c++)
            this.grid[1][c] = new piece_js_1.Pawn('black');
    }
    at(coord) {
        if (!this.inBounds(coord))
            return null;
        return this.grid[coord.r][coord.c];
    }
    inBounds(coord) {
        return coord.r >= 0 && coord.r < 8 && coord.c >= 0 && coord.c < 8;
    }
    isEnemyAt(coord, color) {
        const p = this.at(coord);
        return !!p && p.color !== color;
    }
    clearPath(from, to) {
        const dr = Math.sign(to.r - from.r);
        const dc = Math.sign(to.c - from.c);
        let r = from.r + dr, c = from.c + dc;
        while (r !== to.r || c !== to.c) {
            if (this.grid[r][c])
                return false;
            r += dr;
            c += dc;
        }
        return true;
    }
    move(from, to) {
        if (!this.inBounds(from) || !this.inBounds(to)) {
            return { ok: false, message: 'Coordinates out of bounds' };
        }
        const piece = this.at(from);
        if (!piece)
            return { ok: false, message: 'No piece at start square' };
        if (from.r === to.r && from.c === to.c)
            return { ok: false, message: 'Start and end are the same square' };
        const target = this.at(to);
        if (target && target.color === piece.color) {
            return { ok: false, message: 'Cannot capture your own piece' };
        }
        if (!piece.canMove(from, to, this)) {
            return { ok: false, message: `Illegal ${piece.type} move` };
        }
        // perform move
        const wasKing = target?.type === piece_js_1.PieceType.King;
        this.grid[to.r][to.c] = piece;
        this.grid[from.r][from.c] = null;
        return { ok: true, capturedKing: !!wasKing };
    }
    toString() {
        let s = '';
        for (let r = 0; r < 8; r++) {
            s += (8 - r) + ' ';
            for (let c = 0; c < 8; c++) {
                const p = this.grid[r][c];
                s += (p ? p.symbol() : '.') + ' ';
            }
            s += '\n';
        }
        s += '  a b c d e f g h\n';
        return s;
    }
}
exports.Board = Board;
function coordFromAlgebraic(cell) {
    if (!/^[a-h][1-8]$/i.test(cell))
        return null;
    const file = cell[0].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = parseInt(cell[1], 10);
    // ranks: 1(bottom/white) -> row 7, 8(top) -> row 0
    const r = 8 - rank;
    const c = file;
    return { r, c };
}
function coordFromNumeric(s) {
    const m = s.trim().match(/^([1-8])\s*,\s*([1-8])$/);
    if (!m)
        return null;
    const row = parseInt(m[1], 10); // 1..8, 1 is white back rank
    const col = parseInt(m[2], 10); // 1..8, 1 is file a
    const r = 8 - row;
    const c = col - 1;
    return { r, c };
}
function parseMove(input) {
    const parts = input.trim().split(/\s+/);
    if (parts.length === 1) {
        const [a, b] = parts[0].split(/,|-/).map(x => x.trim());
        if (!a || !b)
            return null;
        const from = coordFromAlgebraic(a) ?? coordFromNumeric(a);
        const to = coordFromAlgebraic(b) ?? coordFromNumeric(b);
        if (!from || !to)
            return null;
        return { from, to };
    }
    if (parts.length === 2) {
        const from = coordFromAlgebraic(parts[0]) ?? coordFromNumeric(parts[0]);
        const to = coordFromAlgebraic(parts[1]) ?? coordFromNumeric(parts[1]);
        if (!from || !to)
            return null;
        return { from, to };
    }
    return null;
}
