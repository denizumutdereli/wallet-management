export const toSmallestUnit = (amount: number, currency: 'BTC' | 'ETH' | 'TRX'): number => {
  switch (currency) {
    case 'BTC':
      return Math.floor(amount * 1e8);
    case 'ETH':
      return Math.floor(amount * 1e18);
    case 'TRX':
      return Math.floor(amount * 1e6);
    default:
      throw new Error('Unsupported currency');
  }
};

export const fromSmallestUnit = (amount: number, currency: 'BTC' | 'ETH' | 'TRX'): number => {
  switch (currency) {
    case 'BTC':
      return amount / 1e8;
    case 'ETH':
      return amount / 1e18;
    case 'TRX':
      return amount / 1e6;
    default:
      throw new Error('Unsupported currency');
  }
};
