import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    password: z
      .string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .regex(/[A-Z]/, 'En az bir büyük harf içermelidir')
      .regex(/[0-9]/, 'En az bir rakam içermelidir'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
