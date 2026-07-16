import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return { status: 'ok', service: 'authapp-backend' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('welcome')
  getWelcomeMessage(@Request() req) {
    return {
      message: 'Welcome to the application.',
      user: req.user,
    };
  }
}
