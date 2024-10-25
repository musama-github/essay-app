import { Controller, UseGuards, Req, Get, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EssayService } from './essay.service';
@Controller('essay')
export class EssayController {
  constructor(private essayService: EssayService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Req() req, @Body('title') title: string, @Body('body') body: string) {
    return this.essayService.createEssay(req.user.userId, title, body);
  }
  @Get('all')
  all() {
    return this.essayService.getAllEssays();
  }
}
