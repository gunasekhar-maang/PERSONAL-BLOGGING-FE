export interface SystemState {
    auth: {
      signin: {
        data: any;
        loader: boolean;
        error: any;
      };
      signup: {
        data: any;
        loader: boolean;
        error: any;
      };
      googleauth: {
        data: any;
        loader: boolean;
        error: any;
      };
      articles:{
          data: any;
          loader: boolean;
          error: any;
        }
    };
    
  }
  