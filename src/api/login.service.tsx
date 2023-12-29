import AsyncStorage from '@react-native-async-storage/async-storage';
import { ASYNC_STORAGE } from '../common/common';

const urlApi = async () => {
  const request = await AsyncStorage.getItem(ASYNC_STORAGE.API_URL);
  return request;
};

export const loginService = async (loginDto: any) => {
  const response = await fetch((await urlApi()) + '/Prod/auth/login', {
    method: 'POST',
    body: JSON.stringify(loginDto),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const resJson = await response.json();
  return resJson;
};
