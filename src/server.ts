import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import DomainRoute from '@routes/domain.route';
import validateEnv from '@utils/validateEnv';
import ExternalWalletRoute from './routes/external-wallet.route';
import WalletRoute from './routes/wallet.route';

validateEnv();

const app = new App([new IndexRoute(), new UsersRoute(), new DomainRoute(), new AuthRoute(), new ExternalWalletRoute(), new WalletRoute()]);
app.listen();
