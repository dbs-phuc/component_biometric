import ReactNativeBiometrics from 'react-native-biometrics';

export declare const BiometryTypes1: {
  TouchID: string;
  FaceID: string;
  Biometrics: string;
};

const BiometricAuthComponent = async (): Promise<any> => {
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
      console.log('biometrics failed');
    });
  return authBiometric;
};

export default BiometricAuthComponent;
