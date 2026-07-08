import * as z from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&^#\-_+=])[A-Za-z\d@$!%*?&^#\-_+=]{8,}$/, {
      message: 'Password must contain at least one letter, one number, and one special character',
    }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SigninFormValues = z.infer<typeof signinSchema>;
