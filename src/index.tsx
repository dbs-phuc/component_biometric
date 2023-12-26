import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import { loginService } from './api/login.service';
import { ASYNC_STORAGE } from './common/common';

const CREATE_KEY = {
  FAILED_KEY: 'CREATE_KEY_FAILED',
};

// export declare const BiometryTypes: {
//   TouchID: string;
//   FaceID: string;
//   Biometrics: string;
// };

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

const settingBiometricComponent = NativeModules.Component;

export const createKeysPublicPrivate = async (): Promise<any> => {
  try {
    const result = await rnBiometrics.createKeys();
    return result;
  } catch (error) {
    throw Error(CREATE_KEY.FAILED_KEY);
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

export const isCheckAvailablrBiometrics = async (): Promise<any> => {
  try {
    const isTypeBiometrics = await rnBiometrics.isSensorAvailable();
    if (isTypeBiometrics.available) {
      return isTypeBiometrics;
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
  authenServerOptionsDto: any
): Promise<any> => {
  try {
    const authBiometric = await rnBiometrics.createSignature(
      authenServerOptionsDto
    );
    return authBiometric;
  } catch (error) {
    throw error;
  }
};

export const setConfig = async (urlApi: string) => {
  AsyncStorage.setItem('URL_API', urlApi);
};
export const checkConfig = async () => {
  const value = await AsyncStorage.getItem('URL_API');
  if (value != null) {
    return true;
  }
  return false;
};

export const handleSignBiometricsServer = async (
  authenBiometricsServer: any
): Promise<any> => {
  try {
    const repsoneLogin: any = await AsyncStorage.getItem(
      ASYNC_STORAGE.STATUS_LOGIN
    );
    const statusLogin = JSON.parse(repsoneLogin);
    //check status login sau nayf dungf api
    if (statusLogin === 1) {
      const repsone = await isCheckAvailablrBiometrics();
      if (repsone.available === true) {
        const authBiometric = await authenBiometricServer(
          authenBiometricsServer
        );
        if (authBiometric.success) {
          return authBiometric;
        } else {
          throw Error(authBiometric.error);
        }
      } else {
        throw Error(repsone.error);
      }
    }
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
        throw new Error(response.code);
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
  authenBiometricServerOptionsDto: any
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
        throw 'CREATE_PUBLIC_RIVATE_FAILED';
      }
    }
  } catch (error: any) {
    throw error;
  }
};
export default setupHandleBiometricsServer;
