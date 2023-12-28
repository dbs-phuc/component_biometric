import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { loginService } from './api/login.service';
import { ASYNC_STORAGE, ERROR_KEY } from './common/common';
import type {
  AuthenServerDTO,
  AuthenServerResult,
  IsAvailableBiometrics,
} from './common/interface';

const settingBiometricComponent = NativeModules.Component;
const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

export const createKeysPublicPrivate = async (): Promise<any> => {
  try {
    const result = await rnBiometrics.createKeys();
    return result;
  } catch (error) {
    throw ERROR_KEY.FAILED_KEY;
  }
};

export const onPressDeleteKeys = async (): Promise<boolean> => {
  const resultObject = await rnBiometrics.deleteKeys();
  const { keysDeleted } = resultObject;
  return keysDeleted;
};

export const onPressExistKeys = async (): Promise<boolean> => {
  const resultObject = await rnBiometrics.biometricKeysExist();
  const { keysExist } = resultObject;
  return keysExist;
};

export function getSupportSetingBiometric() {
  settingBiometricComponent.multiply();
}

export const isCheckAvailablrBiometrics = async (
  isAvailablePassword?: boolean
): Promise<IsAvailableBiometrics> => {
  try {
    rnBiometrics.allowDeviceCredentials = isAvailablePassword || false;
    const availableBiometrics: IsAvailableBiometrics = {
      available: false,
    };
    const isTypeBiometrics = await rnBiometrics.isSensorAvailable();
    if (isTypeBiometrics.available) {
      availableBiometrics.available = isTypeBiometrics.available;
      availableBiometrics.biometryType = isTypeBiometrics.biometryType;
      return availableBiometrics;
    } else {
      throw isTypeBiometrics.error;
    }
  } catch (error: any) {
    console.log('mesages checkAvasssssilable:', error);
    throw error;
  }
};

export const authenBiometricLocal = async (
  authenLoaclOption: any,
  allowDeviceCredentials?: boolean
): Promise<any> => {
  rnBiometrics.allowDeviceCredentials = allowDeviceCredentials ?? false;
  const authBiometric = await rnBiometrics.simplePrompt(authenLoaclOption);
  return authBiometric;
};

export const authenBiometricServer = async (
  authenServerOptionsDto: AuthenServerDTO,
  isAvailablePassword?: boolean
): Promise<any> => {
  try {
    rnBiometrics.allowDeviceCredentials = isAvailablePassword || false;
    const authBiometric = await rnBiometrics.createSignature(
      authenServerOptionsDto
    );
    return authBiometric;
  } catch (error) {
    throw error;
  }
};

export const setConfig = async (urlApi: string) => {
  AsyncStorage.setItem(ASYNC_STORAGE.API_URL, urlApi);
};
export const checkConfig = async () => {
  const value = await AsyncStorage.getItem('URL_API');
  if (value != null) {
    return true;
  }
  return false;
};

export const handleSignBiometricsServer = async (
  authenBiometricsServer: AuthenServerDTO,
  isAvailablePassword?: boolean
): Promise<AuthenServerResult> => {
  try {
    const serverResult: AuthenServerResult = {
      success: false,
    };
    const repsoneLogin: any = await AsyncStorage.getItem(
      ASYNC_STORAGE.STATUS_LOGIN
    );
    const statusLogin = JSON.parse(repsoneLogin);
    //check status login sau nayf dungf api
    if (statusLogin === 1) {
      const repsone = await isCheckAvailablrBiometrics(isAvailablePassword);
      if (repsone.available === true) {
        const authBiometric = await authenBiometricServer(
          authenBiometricsServer,
          isAvailablePassword
        );
        if (authBiometric.success) {
          return authBiometric;
        } else {
          throw authBiometric.error;
        }
      }
    }
    return serverResult;
  } catch (error: any) {
    throw error;
  }
};

export const loginAccountUres = async (loginDto: any): Promise<any> => {
  try {
    const checkConfigValue = await checkConfig();
    if (checkConfigValue) {
      const response = await loginService(loginDto);
      if (!response.message) {
        // api save idDevices status login
        await AsyncStorage.setItem(
          ASYNC_STORAGE.STATUS_LOGIN,
          JSON.stringify(1)
        );
        //hieenj gời sẽ lưu tạm email pass để đăng nhập với lần tiếm theo
        await AsyncStorage.setItem('PROFILE_LOGIN', JSON.stringify(loginDto));
        return response;
      } else {
        throw response.code;
      }
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    return error;
  }
};
export const logout = async () => {
  await AsyncStorage.clear();
};

export const setupHandleBiometricsServer = async (
  authenBiometricServerOptionsDto: AuthenServerDTO
): Promise<any> => {
  try {
    const isAvailable = await isCheckAvailablrBiometrics();
    if (isAvailable.available) {
      const createKey = await createKeysPublicPrivate();
      if (createKey.publicKey) {
        //save publickey server
        const signBiometric = await rnBiometrics.createSignature(
          authenBiometricServerOptionsDto
        );
        if (signBiometric.success) {
          return signBiometric;
          //save signBiometric.signature
        } else {
          throw signBiometric.error;
        }
      } else {
        throw 'CREATE_PUBLIC_PRIVATE_FAILED';
      }
    }
  } catch (error: any) {
    throw error;
  }
};
export default setupHandleBiometricsServer;
