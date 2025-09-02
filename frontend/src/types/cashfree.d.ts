declare module '@cashfreepayments/cashfree-js' {
  interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_modal' | '_self' | '_blank';
  }

  interface CheckoutResult {
    error?: {
      message: string;
      code: string;
    };
    redirect?: boolean;
    paymentDetails?: {
      paymentSessionId: string;
      orderId: string;
    };
  }

  interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<CheckoutResult>;
  }

  interface LoadOptions {
    mode: 'sandbox' | 'production';
  }

  export function load(options: LoadOptions): Promise<CashfreeInstance>;
}