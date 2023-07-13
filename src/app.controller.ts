import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { boardPieceValue } from './types/boardTypes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/getBoard')
  public getBoard(): boardPieceValue[][] {
    return this.appService.getBoard();
  }

  @Post('/move')
  public move(@Body() body: { x: number; y: number }): string {
    return this.appService.move(body.x, body.y);
  }

  @Post('/restartGame')
  public restartGame(): string {
    return this.appService.restartGame();
  }
}
