interface LimitDTO {
  page: string;
  test: boolean;
}

class ApiLimiter {
  readonly DefaultLimit = 100;

  readonly LIMIT = {
    pageType: 'general',
    timeout: 15 * 60 * 1000, // 15 minutes
    max: this.DefaultLimit, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: {
      status: false,
      message: 'Too many conections by same IP, please follow-up x-limits and try again after an hour later.', // i18next.t('WELCOME', {}),
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  };

  constructor(LimitDTO: LimitDTO) {
    if (LimitDTO.test === true) {
      LimitDTO.page = 'test';
    }

    this.LIMIT.pageType = LimitDTO.page;

    switch (LimitDTO.page) {
      case 'action':
        this.LIMIT.max = 50;
        break;
      case 'test':
        this.LIMIT.max = 500;
        break;
      case 'authentication':
        this.LIMIT.max = 10;
        break;
      case 'setup':
      case 'config':
      case 'auth':
        this.LIMIT.max = 10;
        break;
      case 'healthcheck':
      default:
        this.LIMIT.max = 100;
        break;
    }
  }
}

export default ApiLimiter;
