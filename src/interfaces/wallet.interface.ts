export interface Wallet {
  id: string;
  network: string;
  testnet: string;
  address: string;
  index: number;
  mainWallet: string;
  user: string;
  domain: string;
  customerId: string;
  date?: () => Date | number;
  created_by?: string;
  updated_by?: string;
  deletedBy?: string;
}
