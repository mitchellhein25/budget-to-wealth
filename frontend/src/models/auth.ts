export interface SessionUser {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
    email_verified?: boolean;
    updated_at?: string;
    [key: string]: any;
  }
  
  export interface SessionResponse {
    user: SessionUser;
    [key: string]: any;
  }