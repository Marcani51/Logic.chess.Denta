"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pawn = exports.King = exports.Knight = exports.Queen = exports.Bishop = exports.Rook = exports.Piece = exports.PieceType = void 0;
var PieceType;
(function (PieceType) {
    PieceType["Pawn"] = "P";
    PieceType["Rook"] = "R";
    PieceType["Knight"] = "N";
    PieceType["Bishop"] = "B";
    PieceType["Queen"] = "Q";
    PieceType["King"] = "K";
})(PieceType || (exports.PieceType = PieceType = {}));
class Piece {
    color;
    type;
    constructor(color, type) {
        this.color = color;
        this.type = type;
    }
    symbol() {
        const s = this.type;
        return this.color === 'white' ? s : s.toLowerCase();
    }
}
exports.Piece = Piece;
class Rook extends Piece {
    constructor(color) { super(color, PieceType.Rook); }
    canMove(from, to, ctx) {
        if (from.r !== to.r && from.c !== to.c)
            return false;
        if (!ctx.clearPath(from, to))
            return false;
        const target = ctx.at(to);
        return !target || target.color !== this.color;
    }
}
exports.Rook = Rook;
class Bishop extends Piece {
    constructor(color) { super(color, PieceType.Bishop); }
    canMove(from, to, ctx) {
        const dr = Math.abs(to.r - from.r);
        const dc = Math.abs(to.c - from.c);
        if (dr !== dc)
            return false;
        if (!ctx.clearPath(from, to))
            return false;
        const target = ctx.at(to);
        return !target || target.color !== this.color;
    }
}
exports.Bishop = Bishop;
class Queen extends Piece {
    constructor(color) { super(color, PieceType.Queen); }
    canMove(from, to, ctx) {
        const rookLike = (from.r === to.r || from.c === to.c);
        const bishopLike = (Math.abs(to.r - from.r) === Math.abs(to.c - from.c));
        if (!rookLike && !bishopLike)
            return false;
        if (!ctx.clearPath(from, to))
            return false;
        const target = ctx.at(to);
        return !target || target.color !== this.color;
    }
}
exports.Queen = Queen;
class Knight extends Piece {
    constructor(color) { super(color, PieceType.Knight); }
    canMove(from, to, ctx) {
        const dr = Math.abs(to.r - from.r);
        const dc = Math.abs(to.c - from.c);
        if (!((dr === 2 && dc === 1) || (dr === 1 && dc === 2)))
            return false;
        const target = ctx.at(to);
        return !target || target.color !== this.color;
    }
}
exports.Knight = Knight;
class King extends Piece {
    constructor(color) { super(color, PieceType.King); }
    canMove(from, to, ctx) {
        const dr = Math.abs(to.r - from.r);
        const dc = Math.abs(to.c - from.c);
        if (dr > 1 || dc > 1)
            return false;
        const target = ctx.at(to);
        return !target || target.color !== this.color;
    }
}
exports.King = King;
class Pawn extends Piece {
    constructor(color) { super(color, PieceType.Pawn); }
    canMove(from, to, ctx) {
        const dir = this.color === 'white' ? -1 : 1;
        const startRow = this.color === 'white' ? 6 : 1;
        const dr = to.r - from.r;
        const dc = to.c - from.c;
        // forward move
        if (dc === 0) {
            if (dr === dir && !ctx.at(to))
                return true;
            if (from.r === startRow && dr === 2 * dir) {
                const mid = { r: from.r + dir, c: from.c };
                if (!ctx.at(mid) && !ctx.at(to))
                    return true;
            }
            return false;
        }
        // diagonal capture
        if (Math.abs(dc) === 1 && dr === dir) {
            const target = ctx.at(to);
            return !!target && target.color !== this.color;
        }
        return false;
    }
}
exports.Pawn = Pawn;
