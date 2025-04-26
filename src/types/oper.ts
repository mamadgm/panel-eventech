// POST request body
export interface OperatorData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  password_confirm: string;
}

// GET response type
export interface OperatorDataGET {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
}


export interface OperatorPass {
  password: string;
  password_confirm: string;
}