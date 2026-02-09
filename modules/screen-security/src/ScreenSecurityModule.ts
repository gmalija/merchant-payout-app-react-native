import { NativeModule, requireNativeModule } from 'expo';

export interface ScreenSecurityModuleInterface extends NativeModule {
  getDeviceId(): string;
  isBiometricAuthenticated(): Promise<boolean>;
}

export default requireNativeModule<ScreenSecurityModuleInterface>('ScreenSecurity');