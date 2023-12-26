import AsyncStorage from '@react-native-async-storage/async-storage';

const urlApi = async () => {
  return await AsyncStorage.getItem('URL_API');
};

export const loginService = async (loginDto: any) => {
  const response = await fetch(urlApi + '/Prod/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginDto),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const resJson = await response.json();
  return resJson;
};
