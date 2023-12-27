import { ADMIN, ADMIN_PASSWORD, API_URL, APP_NAME, DEFAULT_TOKEN_LIFE, INTERNAL_IPS, TESTADMIN, TESTPASSWORD, TESTUSER } from '@/config';
import { DomainStatus, DomainTransports } from '@/enums/domain.enums';
import { errs } from '@/exceptions/HttpException';
import i18n from '@/i18n';
import { Domain } from '@/interfaces/domain.interface';
import domainModal from '@/models/domain.model';
import { User } from '@interfaces/users.interface';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateDefaultResponse } from './home.dto';
import { HomeValidator } from './home.validator';

// import { generateWallet, Currency } from '@tatumio/tatum';

export interface HomeService {
  index(): Promise<CreateDefaultResponse>;
  setup(): Promise<CreateDefaultResponse>;
  config(): Promise<CreateDefaultResponse>;
  // wallet(): Promise<any>;
  // balance(address: string): Promise<any>;
}

export function initHomeService(users: Model<User>): HomeService {
  const service = new HomeValidator(new Service(users));
  return service;
}

class Service implements HomeService {
  constructor(private readonly users: Model<User>) {}

  public async index(): Promise<CreateDefaultResponse> {
    const defaultWelcome = `Welcome to the ${APP_NAME} API`;
    return { status: true, data: defaultWelcome };
  }

  // public async wallet(): Promise<any> {
  //   const BTC = new BitcoinService('8ab0183d-f535-434d-9f0f-f3336a32d880');
  //   const wallet = await BTC.createWallet();
  //   console.log(wallet, '-----');
  //   return { status: true, data: wallet };
  // }

  // public async balance(address: string): Promise<any> {
  //   const BTC = new BitcoinService('8ab0183d-f535-434d-9f0f-f3336a32d880');
  //   const balance = await BTC.getBalance(address);
  //   console.log(balance, '-----');
  //   return { status: true, data: balance };
  // }

  public async setup(): Promise<any> {
    const check = await this.users.findOne({ email: ADMIN });
    if (check && check.status === 'ACTIVE') {
      const err = errs.VALIDATION(`${i18n.t('SETUP.PREVIOUS')}`);
      throw err;
    }

    const setupUsers = [
      { email: ADMIN, password: ADMIN_PASSWORD, role: 'admin', domain: -1, status: 'ACTIVE' },
      { email: TESTADMIN, password: TESTPASSWORD, role: 'admin', domain: -1, status: 'ACTIVE' },
      { email: TESTUSER, password: TESTPASSWORD, role: 'user', domain: -1, status: 'ACTIVE' },
    ];
    const users = [];

    const defaultDomain: Partial<Domain> = {
      name: 'DEFAULT DOMAIN',
      status: DomainStatus.ACTIVE,
      callback: API_URL,
      config: {
        default: true,
        token_life: DEFAULT_TOKEN_LIFE,
        white_list: true,
        ips: INTERNAL_IPS.split(',') || ['127.0.0.1'],
        transport: DomainTransports.GRPC_HTTPS,
      },
    };

    try {
      const domain = await domainModal.create(defaultDomain);

      await Promise.all(
        setupUsers.map(async user => {
          user.domain = domain.id;
          user.password = user.password || 'password';
          user.password = await bcrypt.hash(user.password.toString(), 10);
          await this.users.create(user);
          user.password = '*********';
          users.push(user);
        }),
        // Create default domain and set status to active
      );

      return {
        status: true,
        data: `${i18n.t('SETUP.CREATED')}`,
      };
    } catch (error) {
      if (error.name === 'MongoServerError' && error.code === 11000) {
        // Handle duplicate entry error
        const keyPattern = Object.keys(error.keyPattern);
        const key = keyPattern.join(',');
        const err = errs.VALIDATION(`${i18n.t('ALREADY_EXISTS', { name: key })}`);
        throw err;
      } else if (error.name === 'ValidationError') {
        const key = error.message;
        const err = errs.VALIDATION(key);
        throw err;
      } else {
        // Handle other errors
        const err = errs.VALIDATION(`Error creating users: ${error.message}`);
        throw err;
      }
    }
  }

  public async config(): Promise<CreateDefaultResponse> {
    const configConstants = {};
    return { status: true, data: configConstants };
  }
}

export default HomeService;
