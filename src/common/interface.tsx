import type { BiometryType } from 'react-native-biometrics';

export interface PublicKey {
  publicKey: string;
}

export interface IsAvailableBiometrics {
  available: boolean;
  biometryType?: BiometryType;
}

export interface AuthenLocalDTO {
  promptMessage: string;
  fallbackPromptMessage?: string;
  cancelButtonText?: string;
}

export interface AuthenServerDTO {
  promptMessage: string;
  payload: string;
  cancelButtonText?: string;
}

export interface AuthenServerResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export interface IConfig {
  apiUrl: string;
}
