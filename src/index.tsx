import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, NativeModules } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import type { GetIdStepDTO, LoginDTO } from './common/dto/login.dto';
import { Login, getIdStep } from './api/login.service';

export interface CreateSignatureResult {
  success: boolean;
  signature?: string;
  error?: unknown;
}

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});

const settingBiometricComponent = NativeModules.Component;

export const asyncStoreKeys = async (keys: string) => {
  try {
    await AsyncStorage.setItem('keys', JSON.stringify(keys));
    console.log('Keys stored successfully');
  } catch (error) {
    console.log(error);
  }
};

export const asyncGetKeys = async () => {
  try {
    const savedKeys: any = await AsyncStorage.getItem('keys');
    const currentKeys = JSON.parse(savedKeys);
    console.log('storedKeys:', currentKeys);
    return currentKeys;
  } catch (error) {
    console.log(error);
  }
};

export const createBiometricKeys = async (): Promise<any> => {
  try {
    const result = await rnBiometrics.createKeys();
    return {
      publicKey: result.publicKey,
    };
  } catch (error) {
    console.error('Error creating biometric keys:', error);
    throw error;
  }
};

export const onPressDeleteKeys = () => {
  rnBiometrics.deleteKeys().then((resultObject) => {
    const { keysDeleted } = resultObject;

    if (keysDeleted) {
      Alert.alert('Success', 'Successful deletion');
    } else {
      Alert.alert(
        'Error',
        'Unsuccessful deletion because there were no keys to delete'
      );
    }
  });
};

export const onPressExistKeys = (): Promise<any> => {
  return rnBiometrics.biometricKeysExist().then((resultObject) => {
    return resultObject;
  });
};

export declare const componentBiometryTypes: {
  TouchID: string;
  FaceID: string;
  Biometrics: string;
};

export function getSupportSetingBiometric() {
  settingBiometricComponent.multiply();
}

export const biometricAuthComponent = async (
  allowDeviceCredentials?: boolean
): Promise<any> => {
  rnBiometrics.allowDeviceCredentials = allowDeviceCredentials ?? false;
  const biometricType = rnBiometrics
    .isSensorAvailable()
    .then((resultObject) => {
      return resultObject;
    });
  return biometricType;
};

export const authenticate = async (
  title: string,
  textButtonCancel: string,
  fallBackText: string,
  allowDeviceCredentials?: boolean
): Promise<any> => {
  rnBiometrics.allowDeviceCredentials = allowDeviceCredentials ?? false;
  const authBiometric = await rnBiometrics.simplePrompt({
    promptMessage: title,
    fallbackPromptMessage: fallBackText,
    cancelButtonText: textButtonCancel,
  });

  return authBiometric;
};

export const authenticateCreateSignature = async (
  title: string,
  textButtonCancel: string,
  payload: string,
  allowDeviceCredentials?: boolean
): Promise<CreateSignatureResult> => {
  rnBiometrics.allowDeviceCredentials = allowDeviceCredentials ?? false;
  const authBiometric = await rnBiometrics.createSignature({
    promptMessage: title,
    payload: payload,
    cancelButtonText: textButtonCancel,
  });

  return authBiometric;
};

export const authenCreateBiometric = async (
  title: string,
  textButtonCancel: string,
  fallBackText: string,
  allowDeviceCredentials?: boolean
): Promise<any> => {
  try {
    const isAvailable = await rnBiometrics.isSensorAvailable();
    if (isAvailable.available) {
      const authenBiometric = await authenticate(
        title,
        textButtonCancel,
        fallBackText,
        allowDeviceCredentials
      ).then((request) => {
        console.log(request);
      });
      return authenBiometric;
    } else throw isAvailable.error;
  } catch (error: any) {
    throw new Error(error);
  }
};

export class LoginModule {
  allowDeviceCredentials?: boolean;

  constructor(rnBiometricsOptions?: boolean) {
    this.allowDeviceCredentials = rnBiometricsOptions ?? false;
  }

  login(logingDto: LoginDTO): Promise<any> {
    try {
      const response = Login(logingDto);
      return response;
    } catch (error) {
      throw error;
    }
  }
  getiDStep(stepFunctionId: GetIdStepDTO, headers: Headers): Promise<any> {
    try {
      const response = getIdStep(stepFunctionId, headers);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default biometricAuthComponent;
