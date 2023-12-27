import { SECRET_KEY } from '@/config';
import crypto from 'crypto-js';

export const encryptString = (value: string, secretKey: string = SECRET_KEY): string => {
  console.log(value, secretKey);
  const ciphertext = crypto.AES.encrypt(value, secretKey);
  return ciphertext.toString();
};

export const decryptString = (encrypted: string, secretKey: string = SECRET_KEY): string => {
  const bytes = crypto.AES.decrypt(encrypted, secretKey);
  return bytes.toString(crypto.enc.Utf8);
};
