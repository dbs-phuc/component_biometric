export class LoginDTO {
  userName?: string;
  password?: string;
  module?: string = 'LIVE';
}

export class GetIdStepDTO {
  daicd?: string;
}

export interface Headers {
  'Content-type': string;
  'Authorization': string;
  'CompanyId': string;
  'Roleid': string;
}
