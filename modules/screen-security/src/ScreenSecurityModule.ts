import { NativeModule, requireNativeModule } from 'expo';

export interface ScreenSecurityModuleInterface extends NativeModule {
  getDeviceId(): string;
}

export default requireNativeModule<ScreenSecurityModuleInterface>('ScreenSecurity');