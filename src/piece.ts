
export type Color = 'white' | 'black';

export enum PieceType {
  Pawn = 'P',
  Rook = 'R',
  Knight = 'N',
  Bishop = 'B',
  Queen = 'Q',
  King = 'K',
}

export interface Coord { r: number; c: number; }

// coba buat parent piece tiap bidak caturnya,
// rule jalannya
export abstract class Piece {
  constructor(public color: Color, public type: PieceType) {}
  abstract canMove(from: Coord, to: Coord, ctx: MoveContext): boolean;
  symbol(): string {
    // inputan dari pemain 
    const s = this.type;
    return this.color === 'white' ? s : s.toLowerCase();
  }
}

// untuk tiap kontex path rule dan informasi posisi bidak dan validasi tiap gerak bidak
export interface MoveContext {
  at(coord: Coord): Piece | null;
  clearPath(from: Coord, to: Coord): boolean;
  isEnemyAt(coord: Coord, color: Color): boolean;
  inBounds(coord: Coord): boolean;
}

export class Rook extends Piece {
  constructor(color: Color){ super(color, PieceType.Rook); }
  canMove(from: Coord, to: Coord, ctx: MoveContext): boolean {
    if (from.r !== to.r && from.c !== to.c) return false;
    if (!ctx.clearPath(from, to)) return false;
    const target = ctx.at(to);
    return !target || target.color !== this.color;
  }
}

export class Bishop extends Piece {
  constructor(color: Color){ super(color, PieceType.Bishop); }
  canMove(from: Coord, to: Coord, ctx: MoveContext): boolean {
    const dr = Math.abs(to.r - from.r);
    const dc = Math.abs(to.c - from.c);
    if (dr !== dc) return false;
    if (!ctx.clearPath(from, to)) return false;
    const target = ctx.at(to);
    return !target || target.color !== this.color;
  }
}

export class Queen extends Piece {
  constructor(color: Color){ super(color, PieceType.Queen); }
  canMove(from: Coord, to: Coord, ctx: MoveContext): boolean {
    const rookLike = (from.r === to.r || from.c === to.c);
    const bishopLike = (Math.abs(to.r - from.r) === Math.abs(to.c - from.c));
    if (!rookLike && !bishopLike) return false;
    if (!ctx.clearPath(from, to)) return false;
    const target = ctx.at(to);
    return !target || target.color !== this.color;
  }
}

export class Knight extends Piece {
  constructor(color: Color){ super(color, PieceType.Knight); }
  canMove(from: Coord, to: Coord, ctx: MoveContext): boolean {
    const dr = Math.abs(to.r - from.r);
    const dc = Math.abs(to.c - from.c);
    if (!((dr === 2 && dc === 1) || (dr === 1 && dc === 2))) return false;
    const target = ctx.at(to);
    return !target || target.color !== this.color;
  }
}

export class King extends Piece {
  constructor(color: Color){ super(color, PieceType.King); }
  canMove(from: Coord, to: Coord, ctx: MoveContext): boolean {
    const dr = Math.abs(to.r - from.r);
    const dc = Math.abs(to.c - from.c);
    if (dr > 1 || dc > 1) return false;
    const target = ctx.at(to);
    return !target || target.color !== this.color;
  }
}

export class Pawn extends Piece {
  constructor(color: Color){ super(color, PieceType.Pawn); }
  canMove(from: Coord, to: Coord, ctx: MoveContext): boolean {
    const dir = this.color === 'white' ? -1 : 1; 
    const startRow = this.color === 'white' ? 6 : 1;
    const dr = to.r - from.r;
    const dc = to.c - from.c;
    // forward move
    if (dc === 0) {
      if (dr === dir && !ctx.at(to)) return true;
      if (from.r === startRow && dr === 2*dir) {
        const mid = { r: from.r + dir, c: from.c };
        if (!ctx.at(mid) && !ctx.at(to)) return true;
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
