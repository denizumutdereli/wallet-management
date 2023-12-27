import { CREDENTIALS, GENERATE_PEER_PORT, LOG_FORMAT, MAX_CONNECTION_TRY, MAX_CONNECTION_TRY_FRAME, NODE_ENV, ORIGIN, PORT } from '@/config';
import i18n from '@/i18n';
import { RouteInterface } from '@/interfaces/route.interface';
import errorMiddleware from '@/middlewares/error.middleware';
import Interception from '@/middlewares/interception.middleware';
import internalMiddleware from '@/middlewares/internal.middleware';
import { paginationMiddleware } from '@/middlewares/paggination.middleware';
import { protectedEndpoint } from '@/middlewares/protected.routes.middleware';
import { sleep } from '@/utils/util';
import { latestTag } from '@/utils/version';
import { dbConnection } from '@databases';
import { errs } from '@exceptions/HttpException';
import { logger, stream } from '@utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, Router } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import http from 'http';
import i18nextMiddleware from 'i18next-http-middleware';
import { connect, set } from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public abv: any;
  public server: http.Server;

  constructor(routes: RouteInterface[]) {
    this.app = express();

    this.app.use(
      cors({
        origin: ORIGIN === '*' || NODE_ENV !== 'production' ? ORIGIN : ORIGIN.split(','),
        methods: ['GET'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }),
    );
    this.app.use(express.static(path.join(__dirname, '/public')));
    this.server = http.createServer(this.app);

    this.env = NODE_ENV || 'development';
    this.port = GENERATE_PEER_PORT === 'true' ? Math.floor(3001 + Math.random() * 30) + 1 : PORT;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);

    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeUtils();
    this.initializeScheduller();
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`App listening on the port ${this.port}`);
      logger.info(`=============${latestTag || '0.0.1'}===============`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    let attempts = 0;
    while (attempts < parseInt(MAX_CONNECTION_TRY, 10)) {
      sleep(attempts * parseInt(MAX_CONNECTION_TRY_FRAME, 10)); //1st is zero
      try {
        if (this.env !== 'production') {
          set('debug', true);
        }

        set('strictQuery', true); //for strict queries - false will return docs if any field is matched

        connect(dbConnection.url);
        break;
      } catch (error) {
        attempts++;
        logger.error(`Connection to the database attempt #${attempts} failed. Error: ${error.message}`, { stack: error.stack });
      }
    }
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb', strict: true }));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(Interception);

    //i18n integration
    this.app.use(i18nextMiddleware.handle(i18n.I18n));
  }

  private initializeRoutes(routes: RouteInterface[]) {
    //order is matters
    this.app.use('/api', internalMiddleware, protectedEndpoint, Router());

    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    //manually configure @swc/cli -> pay attention there are vulnerabilities in older versions. That's why I am not adding to the package.json file
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeUtils() {
    // catch 404 and forward to error handler
    this.app.use((req: Request, res: Response) => {
      const err = errs.NOT_FOUND('Method or function not found!');
      return res.status(err.getStatus()).json(err.serialize());
    });

    //paggination handler
    this.app.use(paginationMiddleware);
  }

  private initializeScheduller() {
    //Scheduler
    // setInterval(function () {
    //   ScheduleController();
    // }, process.env.DEFAULT_INTERVAL_SECONDS * 1000);
  }
}

export default App;
