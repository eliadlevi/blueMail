import { Injectable } from '@nestjs/common';
import { boardPieceValue, playerOptions } from './types/boardTypes';

@Injectable()
export class AppService {
  private startingPlayer: playerOptions = 'X';

  // keep track of the current turn X\O
  private currentTurn: playerOptions = this.startingPlayer;
  private board: boardPieceValue[][] = [];

  private boardSize: number = 3;

  // make sure that the players nopt trying to play done game
  private lockedSystem: boolean = false;

  constructor() {
    for (let xIndex = 0; xIndex < this.boardSize; xIndex++) {
      let yPieces: boardPieceValue[] = [];
      for (let yIndex = 0; yIndex < this.boardSize; yIndex++) {
        yPieces.push('*');
      }
      this.board.push(yPieces);
    }
  }

  getBoard(): boardPieceValue[][] {
    return this.board;
  }

  public move(x: number, y: number) {
    if (!this.lockedSystem) {
      if (this.isValidMove(x, y)) {
        this.board[x][y] = this.currentTurn;
        if (this.isWining()) {
          return `${this.currentTurn} WON!!!`;
        }
        this.changeCurrentTurn();

        return `turn of ${this.currentTurn}`;
      } else {
        return `Invalid move to location ${x}, ${y}`;
      }
    } else {
      return 'The game is done, if you want to keep playing restart the game';
    }
  }

  public restartGame() {}

  private isValidMove(x: number, y: number): boolean {
    const requstedCell = this.board[x][y];
    return requstedCell === '*' && x < this.boardSize && y < this.boardSize;
  }

  private changeCurrentTurn() {
    if (this.currentTurn === 'X') {
      this.currentTurn = 'O';
    } else {
      this.currentTurn = 'X';
    }
  }

  private isWining(): boolean {
    const isVerticalOrHorizontalWin = this.isVerticalOrHorizontalWin();
    // if the game is won then it is locking the game
    this.lockedSystem = isVerticalOrHorizontalWin
      ? isVerticalOrHorizontalWin
      : this.isDiagonallyWin();

    return this.lockedSystem;
  }

  private isVerticalOrHorizontalWin(): boolean {
    for (let xIndex = 0; xIndex < this.boardSize; xIndex++) {
      // check if there is a row win
      if (
        this.board[xIndex].every(
          (currentCell) =>
            currentCell === this.board[xIndex][0] &&
            !this.isEmptyCell(xIndex, 0),
        )
      ) {
        return true;
      }
      for (let yIndex = 0; yIndex < this.boardSize; yIndex++) {
        if (this.board[xIndex][yIndex + 1] === undefined) {
          return true;
        }
        if (
          this.board[xIndex][yIndex] !== this.board[xIndex][yIndex + 1] ||
          this.isEmptyCell(xIndex, yIndex)
        ) {
          break;
        }
      }
    }
    return false;
  }
  private isDiagonallyWin(): boolean {
    //check diagonally win
    let firstDiagonallyWin = true;
    let secndeDiagonallyWin = true;
    for (let index = 0; index < this.boardSize; index++) {
      // check one way across
      if (
        (index + 1 < this.boardSize &&
          this.board[index][index] !== this.board[index + 1][index + 1] &&
          firstDiagonallyWin) ||
        this.isEmptyCell(index, index)
      ) {
        firstDiagonallyWin = false;
      }

      // check second way across
      if (
        (this.boardSize - index - 2 > 0 &&
          this.board[this.boardSize - index - 1][this.boardSize - index - 1] !==
            this.board[this.boardSize - index - 2][
              this.boardSize - index - 2
            ] &&
          secndeDiagonallyWin) ||
        this.isEmptyCell(index, index)
      ) {
        secndeDiagonallyWin = false;
      }
    }

    return firstDiagonallyWin ? firstDiagonallyWin : secndeDiagonallyWin;
  }

  private isEmptyCell(x: number, y: number) {
    return this.board[x][y] === '*';
  }
}
