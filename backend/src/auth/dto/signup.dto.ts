import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'User email address (must be a valid email format)',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'Full name of the user (minimum 3 characters)',
    example: 'John Doe',
    minLength: 3,
  })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({
    description:
      'Password (min 8 chars, must include at least one letter, one number, and one special character: @$!%*?&^#-_+=)',
    example: 'Secure@123',
    minLength: 8,
    pattern: '^(?=.*[a-zA-Z])(?=.*\\d)(?=.*[@$!%*?&^#\\-_+=])[A-Za-z\\d@$!%*?&^#\\-_+=]{8,}$',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^#\-_+=])[A-Za-z\d@$!%*?&^#\-_+=]{8,}$/, {
    message: 'Password must contain at least one letter, one number, and one special character',
  })
  password: string;
}
