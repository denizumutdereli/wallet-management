import { newEnforcer } from 'casbin';
import { join } from 'path';

export const cosbin = async () => {
  // Load the model and policy from files.
  const enforcer = await newEnforcer(join(__dirname, 'rbac_model.conf'), join(__dirname, 'rbac_policy.csv'));

  enforcer.addFunction('isMerchantAndKYCCompleted', (args: any[]) => {
    return true;
  });

  // Role-based access control rules.

  enforcer.addPolicy('', '/', 'get');
  enforcer.addPolicy('', '/auth', 'post');
  enforcer.addPolicy('', '/refresh', 'post');
  enforcer.addPolicy('', '/logout', 'post');
  enforcer.addPolicy('', '/api/', '');
  enforcer.addPolicy('', '/api/config', 'get');

  // Route level access control rules.
  // Users can access
  enforcer.addPolicy('user', '/api/user', 'get');
  enforcer.addPolicy('domain', '/api/domain', 'get');

  // Admins can access
  enforcer.addPolicy('admin', '/api/wallet', '');
  enforcer.addPolicy('admin', '/api/wallet/:customerId', 'get');
  enforcer.addPolicy('admin', '/api/wallet', 'get');
  enforcer.addPolicy('admin', '/api/wallet/:network/:testnet', 'get');
  enforcer.addPolicy('admin', '/api/wallet/*', 'post');
  enforcer.addPolicy('admin', '/api/wallet', 'post');

  enforcer.addPolicy('admin', '/api/user', 'get');
  enforcer.addPolicy('admin', '/api/user/create', 'post');
  enforcer.addPolicy('admin', '/api/user/update/*', 'patch');
  enforcer.addPolicy('admin', '/api/user/autocomplete/:query', 'get');
  enforcer.addPolicy('admin', '/api/user/delete/:id', 'delete');

  // Domain access control rules.
  enforcer.addPolicy('admin', '/api/domain', 'get');
  enforcer.addPolicy('admin', '/api/domain/create', 'post');
  enforcer.addPolicy('admin', '/api/domain/update/:id', 'patch');
  enforcer.addPolicy('admin', '/api/domain/autocomplete/:query', 'get');
  enforcer.addPolicy('admin', '/api/domain/*', 'delete');

  // External Wallet access control rules.
  enforcer.addPolicy('admin', '/api/external-wallet', 'post');
  enforcer.addPolicy('admin', '/api/external-wallet', 'get');
  // enforcer.addPolicy('admin', '/api/node-wallet', 'post');

  // Virtual Wallet access control rules.
  // enforcer.addPolicy('admin', '/api/virtual-wallet', 'post');

  //   enforcer.addPolicy('admin', '/adminnotallowed', '*', 'deny');
  //   enforcer.addPolicy('user', '/profile', '*', 'allow');
  //   enforcer.addPolicy('user', 'isMerchantAndKYCCompleted(user)', '/merchant/add', 'allow');
  //   enforcer.addPolicy('user', '*', '*', 'deny');
  //   enforcer.addPolicy('admin', '*', '*', 'allow');

  // enforcer.addPolicy('', '', '', 'deny');
  // Save the policy back to the file.
  enforcer.savePolicy();

  return enforcer;
};
