import { MAX_CONNECTION_TRY, MAX_CONNECTION_TRY_FRAME, REDIS_PORT, REDIS_SECRET_KEY, REDIS_URL } from '@/config';
import { TokenData } from '@/interfaces/auth.interface';
import { logger } from '@utils/logger';
import Redis from 'ioredis';

//TODO: any to -> type changes

export default class RedisClient {
  private maxServerTry: number;
  private channel: any;
  private timeout: any;
  private server: any;

  constructor(Retry = 1) {
    this.timeout;
    this.maxServerTry = Retry ? Retry : 1;
    this.channel = new Redis({
      host: REDIS_URL,
      port: parseInt(REDIS_PORT),
      password: REDIS_SECRET_KEY,
      retryStrategy: function (maxServerTry) {
        console.log(maxServerTry, MAX_CONNECTION_TRY);
        if (maxServerTry <= parseInt(MAX_CONNECTION_TRY)) {
          const delay = maxServerTry * parseInt(MAX_CONNECTION_TRY_FRAME);
          logger.error(
            `Unable to connect to the Redis server; Try No: ${maxServerTry} delay: ${maxServerTry * parseInt(MAX_CONNECTION_TRY_FRAME)} ms`,
          );
          return delay;
        } else {
          logger.warn('Unable connect to the Redis server. Exiting with errors.');
          process.exit(1);
        }
      },
    });

    this.channel.on('ready', () => {
      this.maxServerTry = 1;
      logger.info('Redis client is ready and connected to ' + REDIS_URL);
    });

    this.channel.on('connect', () => {
      console.log('Connected to and authenticated with Redis server: ' + REDIS_URL);
    });

    this.channel.on('error', errors => {
      this.maxServerTry++;
      if (this.maxServerTry >= parseInt(MAX_CONNECTION_TRY)) {
        logger.warn('Unable connect to the Redis server. Exiting with errors.', errors);
        process.exit(1);
      }
    });
  }

  async setKeyValue(key: string, payload: any) {
    this.channel.set(key, JSON.stringify(payload));
  }

  async getKeyValue(key: string): Promise<TokenData> {
    return new Promise((resolve, reject) => {
      this.channel.get(key, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(result));
      });
    });
  }

  async deleteKey(key: string) {
    this.channel.del(key.toString());
  }

  async listOfKeys() {
    return this.channel.keys('*');
  }

  async listOfValues() {
    const keys = this.listOfKeys();
    return this.channel.mget(keys);
  }
}
