import { config } from 'dotenv';
process.env.NODE_ENV = process.env.NODE_ENV === undefined ? 'production' : process.env.NODE_ENV;
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  SECRET_KEY,
  ETH_NODE,
  TATUM_API_KEY,
  DEFAULT_FIAT_CURRENCY,
  MAX_WALLET_PER_DOMAIN_NETWORK,
  REFRESH_SECRET_KEY,
  TOKEN_LIFE_IN_SECS,
  REFRESH_TOKEN_LIFE_IN_SECS,
  DEFAULT_TOKEN_LIFE,
  LOGSERVER,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  SECURE,
  MAX_CONNECTION_TRY,
  MAX_CONNECTION_TRY_FRAME,
  MONGO_INITDB_DATABASE,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_AUTH_DATABASE,
  MONGO_HOST,
  MONGO_PORT,
  API_URL,
  APP_NAME,
  GENERATE_PEER_PORT,
  PROXY,
  TRANSPORTS,
  CERTIFICATE_FOLDER,
  ADMIN,
  ADMIN_PASSWORD,
  TESTUSER,
  TESTADMIN,
  TESTPASSWORD,
  TESTDOMAIN,
  DEFAULT_LANGUAGE,
  AVAILABLE_LANGUAGES,
  REDIS_PORT,
  REDIS_SECRET_KEY,
  REDIS_URL,
  INTERNAL_IPS,
  BRIDGE_API,
} = process.env;