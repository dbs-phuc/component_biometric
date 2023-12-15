import { NativeModules } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const Component = NativeModules.Component;
export declare const componentBiometryTypes: {
  TouchID: string;
  FaceID: string;
  Biometrics: string;
};

export function runComponentSetting() {
  Component.multiply();
}

const biometricAuthComponent = async (): Promise<any> => {
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: false,
  });
  const biometricType = rnBiometrics
    .isSensorAvailable()
    .then((resultObject) => {
      return resultObject;
    });
  return biometricType;
};

export const authenticate = (
  title: string,
  textButtonCancel: string,
  fallBackText: string,
  callBackFuntionSuccess: any,
  callBackFuntionError: any,
  callBackFuntionFailed: any,
  allowDeviceCredentialsPin?: boolean
): Promise<any> => {
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: allowDeviceCredentialsPin,
  });
  const authBiometric = rnBiometrics
    .simplePrompt({
      promptMessage: title,
      fallbackPromptMessage: fallBackText,
      cancelButtonText: textButtonCancel,
    })
    .then((resultObject) => {
      const { success } = resultObject;
      if (success) {
        return callBackFuntionSuccess();
      } else return callBackFuntionError();
    })
    .catch(() => {
      return callBackFuntionFailed();
    });
  return authBiometric;
};

export default biometricAuthComponent;
