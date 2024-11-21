export interface SignupFormData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }

export interface LoginFormData{
    email : string ;
    password : string
}

export interface BearerToken {
    access_token : string ;
    token_type : string
}