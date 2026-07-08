import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user account. Returns a JWT access token along with the created user profile.',
  })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        message: 'Signup successful',
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwic3ViIjoiNjY5YTEyMzQ1Njc4OTBhYmNkZWYxMjM0IiwidG9rZW5WZXJzaW9uIjowLCJpYXQiOjE3MjAwMDAwMDAsImV4cCI6MTcyMDA4NjQwMH0.example',
        user: {
          id: '669a1234567890abcdef1234',
          email: 'john.doe@example.com',
          name: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict — email already registered',
    schema: {
      example: {
        statusCode: 409,
        message: 'User with this email already exists',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request — validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'Invalid email format',
          'Name must be at least 3 characters long',
          'Password must contain at least one letter, one number, and one special character',
        ],
        error: 'Bad Request',
      },
    },
  })
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Sign in with existing credentials',
    description:
      'Authenticates a user with email and password. Returns a JWT access token valid for 24 hours.',
  })
  @ApiBody({ type: SigninDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    schema: {
      example: {
        message: 'Signin successful',
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwic3ViIjoiNjY5YTEyMzQ1Njc4OTBhYmNkZWYxMjM0IiwidG9rZW5WZXJzaW9uIjoxLCJpYXQiOjE3MjAwMDAwMDAsImV4cCI6MTcyMDA4NjQwMH0.example',
        user: {
          id: '669a1234567890abcdef1234',
          email: 'john.doe@example.com',
          name: 'John Doe',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request — validation failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['Invalid email format', 'Password should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  async signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('Bearer')
  @ApiOperation({
    summary: 'Logout the authenticated user',
    description:
      'Invalidates the current JWT by incrementing the user\'s token version. All previously issued tokens become invalid immediately.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
    schema: {
      example: {
        message: 'Logout successful',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — missing or invalid/expired Bearer token',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }
}
