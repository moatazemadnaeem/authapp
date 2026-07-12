import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: {
    incrementTokenVersion: jest.Mock;
    findByEmail: jest.Mock;
    create: jest.Mock;
    findById: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      incrementTokenVersion: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: { sign: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('increments the token version when a user logs out', async () => {
    usersService.incrementTokenVersion.mockResolvedValue({ id: 'user-id' });

    const result = await service.logout('user-id');

    expect(usersService.incrementTokenVersion).toHaveBeenCalledWith('user-id');
    expect(result).toEqual({ message: 'Logout successful' });
  });
});
