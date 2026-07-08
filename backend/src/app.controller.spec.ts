import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('should return the welcome message for an authenticated user', () => {
    const appController = new AppController(new AppService());

    const result = appController.getWelcomeMessage({
      user: { userId: 'user-123' },
    });

    expect(result).toEqual({
      message: 'Welcome to the application.',
      user: { userId: 'user-123' },
    });
  });
});
