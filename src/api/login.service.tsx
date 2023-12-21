import { GetIdStepDTO, LoginDTO } from '../common/dto/login.dto';
import { environment } from '../environments/environment.dev';

export const Login = async (loginDto: LoginDTO) => {
  const response = await fetch(environment.ApiUrl + '/Prod/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginDto),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const resJson = await response.json();
  return resJson;
};

export const getIdStep = async (
  getIdStepDTO: GetIdStepDTO,
  headers: Headers
) => {
  const response = await fetch(
    environment.ApiUrl + '/Prod/dai-public/get-id-step-function-by-daicd',
    {
      method: 'POST',
      body: JSON.stringify(getIdStepDTO),
      headers: headers,
    }
  );
  const resJson = await response.json();
  return resJson.stepFunctionId;
};
