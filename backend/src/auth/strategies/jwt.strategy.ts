import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret_for_development_only',
    });
  }

  async validate(payload: { sub: string; email: string; tokenVersion: number }) {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User no longer exists.');
    }

    // Token version check — if the user's tokenVersion has been incremented
    // (e.g. after password change), all previously-issued tokens are rejected.
    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Token is no longer valid. Please sign in again.');
    }

    return { userId: payload.sub, email: payload.email, tokenVersion: payload.tokenVersion };
  }
}
