import { ethers } from 'ethers';

export interface HDWalletInfo {
  wallet: ethers.Wallet;
  mnemonic: string;
  xpub: string;
  etherscanLink: string;
}

export class GetWalletFromMnemonicDto {
  mnemonic: string;
  index: number;
}

export class GetERC20TokenContractDto {
  tokenSymbol: string;
}

export class GetERC20TokenBalanceDto {
  contract: ethers.Contract;
  address: string;
}

export class SendETHDto {
  wallet: ethers.Wallet;
  to: string;
  amount: ethers.BigNumber;
}

export interface SendETHWithMnemonicDto {
  mnemonic: string;
  index: number;
  to: string;
  amount: ethers.BigNumber;
}

export class SendERC20TokenDto {
  wallet: ethers.Wallet;
  contract: ethers.Contract;
  to: string;
  amount: ethers.BigNumber;
}

export interface SendERC20TokenWithMnemonicDto {
  mnemonic: string;
  index: number;
  contract: ethers.Contract;
  to: string;
  amount: ethers.BigNumber;
}

export class CheckDepositsDto {
  contractAddress: string;
  abi: any[];
  address: string;
  fromBlock: number;
  toBlock: number;
}

export interface WaitForConfirmationsCallback {
  (confirmations: number, remaining: number): void;
}
export class WaitForConfirmationsDto {
  txHash: string;
  confirmations = 12;
}
