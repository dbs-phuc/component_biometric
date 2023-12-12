import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
export declare const BiometryTypes1: {
  TouchID: string;
  FaceID: string;
  Biometrics: string;
};
const BiometricAuthComponent = async (): Promise<any> => {
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });
  const biometricType = rnBiometrics
    .isSensorAvailable()
    .then((resultObject) => {
      const { available, biometryType } = resultObject;

      if (available && biometryType === BiometryTypes.TouchID) {
        return BiometryTypes.TouchID;
      } else if (available && biometryType === BiometryTypes.FaceID) {
        return BiometryTypes.FaceID;
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        return BiometryTypes.Biometrics;
      } else {
        return 'null';
      }
    });
  return biometricType;
};
export const authenticate = () => {
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });
  rnBiometrics
    .simplePrompt({
      promptMessage: 'Confirm fingerprint',
      fallbackPromptMessage: 'messs',
      cancelButtonText: 'cancel',
    })
    .then((resultObject) => {
      const { success } = resultObject;

      if (success) {
        console.log('successful biometrics provided');
      } else {
        console.log('user cancelled biometric prompt');
      }
    })
    .catch(() => {
      console.log('biometrics failed');
    });
};

export default BiometricAuthComponent;
