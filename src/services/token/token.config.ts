/* eslint-disable @typescript-eslint/no-namespace */
import { SECRET_KEY, REFRESH_SECRET_KEY, TOKEN_LIFE_IN_SECS, REFRESH_TOKEN_LIFE_IN_SECS } from '@/config';

export const config = {
  api_secret: SECRET_KEY,
  refreshTokenSecret: REFRESH_SECRET_KEY,
  tokenLife: parseInt(TOKEN_LIFE_IN_SECS, 10), // 1 hour
  refreshTokenLife: parseInt(REFRESH_TOKEN_LIFE_IN_SECS, 10), // 24 hours
  /* for test */
  // tokenLife: 60,          // 1 minute
  // refreshTokenSecret: 120,  // 2 minutes
};
