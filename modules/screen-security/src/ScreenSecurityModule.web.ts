import { registerWebModule, NativeModule } from 'expo';

import { ScreenSecurityModuleEvents } from './ScreenSecurity.types';

class ScreenSecurityModule extends NativeModule<ScreenSecurityModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ScreenSecurityModule, 'ScreenSecurityModule');
