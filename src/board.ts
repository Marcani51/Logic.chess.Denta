
import { Piece, Rook, Knight, Bishop, Queen, King, Pawn, Color, PieceType, Coord, MoveContext } from './piece';

export class Board implements MoveContext {
  grid: (Piece | null)[][];

  constructor() {
    // inisialisai board 
    this.grid = Array.from({length: 8}, () => Array<Piece|null>(8).fill(null));
    this.init();
  }

  init() {
    const placeBackRank = (row: number, color: Color) => {
      const order: Piece[] = [
        new Rook(color), new Knight(color), new Bishop(color), new Queen(color),
        new King(color), new Bishop(color), new Knight(color), new Rook(color)
      ];
      for (let c = 0; c < 8; c++) this.grid[row][c] = order[c];
    };
    placeBackRank(7, 'white');
    for (let c=0;c<8;c++) this.grid[6][c] = new Pawn('white');
    placeBackRank(0, 'black');
    for (let c=0;c<8;c++) this.grid[1][c] = new Pawn('black');
  }

  at(coord: Coord): Piece | null {
    if (!this.inBounds(coord)) return null;
    return this.grid[coord.r][coord.c];
  }

  inBounds(coord: Coord): boolean {
    return coord.r >= 0 && coord.r < 8 && coord.c >= 0 && coord.c < 8;
  }

  isEnemyAt(coord: Coord, color: Color): boolean {
    const p = this.at(coord);
    return !!p && p.color !== color;
  }

  clearPath(from: Coord, to: Coord): boolean {
    const dr = Math.sign(to.r - from.r);
    const dc = Math.sign(to.c - from.c);
    let r = from.r + dr, c = from.c + dc;
    while (r !== to.r || c !== to.c) {
      if (this.grid[r][c]) return false;
      r += dr; c += dc;
    }
    return true;
  }

  move(from: Coord, to: Coord): { ok: boolean; message?: string; capturedKing?: boolean } {
    // untuk cek tidak salah langkah
    if (!this.inBounds(from) || !this.inBounds(to)) {
      return { ok: false, message: 'Coordinates out of bounds' };
    }
    //cek adakah perubahan posisi
    const piece = this.at(from);
    if (!piece) return { ok: false, message: 'No piece at start square' };
    if (from.r === to.r && from.c === to.c) return { ok: false, message: 'Start and end are the same square' };

    const target = this.at(to);
    if (target && target.color === piece.color) {
      return { ok: false, message: 'Cannot capture your own piece' };
    }

    if (!piece.canMove(from, to, this)) {
      return { ok: false, message: `Illegal ${piece.type} move` };
    }

    const wasKing = target?.type === PieceType.King;
    this.grid[to.r][to.c] = piece;
    this.grid[from.r][from.c] = null;
    return { ok: true, capturedKing: !!wasKing };
  }

  toString(): string {
    let s = '';
    for (let r=0;r<8;r++) {
      s += (8 - r) + ' ';
      for (let c=0;c<8;c++) {
        const p = this.grid[r][c];
        s += (p ? p.symbol() : '.') + ' ';
      }
      s += '\n';
    }
    s += '  a b c d e f g h\n';
    return s;
  }
}

// funngsi untuk ubah notasi catur input 
export function coordFromAlgebraic(cell: string): Coord | null {
  if (!/^[a-h][1-8]$/i.test(cell)) return null;
  const file = cell[0].toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(cell[1], 10);
  
  const r = 8 - rank;
  const c = file;
  return { r, c };
}

// fungsi untuk menerima input coordinat papan 
export function coordFromNumeric(s: string): Coord | null {
  const m = s.trim().match(/^([1-8])\s*,\s*([1-8])$/);
  if (!m) return null;
  const row = parseInt(m[1], 10); 
  const col = parseInt(m[2], 10); 
  const r = 8 - row;
  const c = col - 1;
  return { r, c };
}

export function parseMove(input: string): { from: Coord, to: Coord } | null {
  const parts = input.trim().split(/\s+/);
  if (parts.length === 1) {
    const [a,b] = parts[0].split(/,|-/).map(x => x.trim());
    if (!a || !b) return null;
    const from = coordFromAlgebraic(a) ?? coordFromNumeric(a);
    const to = coordFromAlgebraic(b) ?? coordFromNumeric(b);
    if (!from || !to) return null;
    return { from, to };
  }
  if (parts.length === 2) {
    const from = coordFromAlgebraic(parts[0]) ?? coordFromNumeric(parts[0]);
    const to = coordFromAlgebraic(parts[1]) ?? coordFromNumeric(parts[1]);
    if (!from || !to) return null;
    return { from, to };
  }
  return null;
}
