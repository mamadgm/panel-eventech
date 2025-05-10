export interface LoginRequest {
    phone_number: string
    password: string
  }
  
  export interface LoginResponse {
    refresh_token: string
    access_token: string
    first_name: string
    last_name: string
  }
  