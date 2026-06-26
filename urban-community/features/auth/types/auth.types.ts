import { z } from 'zod';

const registerPasswordSchema = z
  .string()
  .min(6, 'Şifre en az 6 karakter olmalıdır')
  .regex(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir')
  .regex(/[a-z]/, 'Şifre en az bir küçük harf içermelidir')
  .regex(/[0-9]/, 'Şifre en az bir rakam içermelidir');

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(1, 'Şifre alanı boş bırakılamaz'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter olmalıdır'),
    email: z.string().email('Geçerli bir e-posta adresi girin'),
    password: registerPasswordSchema,
    confirmPassword: z.string().min(1, 'Şifre tekrarı boş olamaz'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
