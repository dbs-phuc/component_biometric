import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, NativeModules } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

export interface CreateSignatureResult {
  success: boolean;
  signature?: string;
  error?: unknown;
}

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: false,
});
let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
let payload = epochTimeSeconds + 'some message';
const settingBiometricComponent = NativeModules.SettingBiometric;

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
  settingBiometricComponent.getSupportSetingBiometric();
}

const biometricAuthComponent = async (): Promise<any> => {
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
  fallBackText: string
): Promise<any> => {
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
  fallBackText: string
): Promise<CreateSignatureResult> => {
  const authBiometric = await rnBiometrics.createSignature({
    promptMessage: title,
    payload: payload,
    fallbackPromptMessage: fallBackText,
    cancelButtonText: textButtonCancel,
  });

  return authBiometric;
};

export const authenCreateBiometric = async (
  title: string,
  textButtonCancel: string,
  fallBackText: string
): Promise<CreateSignatureResult> => {
  const authSignatureResult: CreateSignatureResult = {
    success: false,
    signature: '',
    error: undefined,
  };

  try {
    const isAvailable = await rnBiometrics.isSensorAvailable();
    if (isAvailable.available) {
      const existKeys = await onPressExistKeys();
      if (existKeys) {
        return await authenticateCreateSignature(
          title,
          textButtonCancel,
          fallBackText
        );
      } else {
        const createKeys = await createBiometricKeys();
        if (createKeys) {
          const authenBiometric = await authenticateCreateSignature(
            title,
            textButtonCancel,
            fallBackText
          );
          return authenBiometric;
        }
      }
    } else {
      throw new Error(isAvailable.error);
    }
  } catch (error: any) {
    throw new Error(error);
  }
  return authSignatureResult;
};

export default biometricAuthComponent;
