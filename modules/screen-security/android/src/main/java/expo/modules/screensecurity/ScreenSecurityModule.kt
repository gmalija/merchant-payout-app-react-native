package expo.modules.screensecurity

import android.content.Context
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ScreenSecurityModule : Module() {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ScreenSecurity')` in JavaScript.
    Name("ScreenSecurity")

    Function("getDeviceId") {
      return@Function getDeviceIdentifier()
    }

  }

  private val context: Context
    get() = appContext.reactContext ?: throw Exception("React context is null")

  private fun getDeviceIdentifier(): String {
    // Get ANDROID_ID - unique per device+app combination
    // This persists across app reinstalls and factory resets (on Android 8.0+)
    return Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
      ?: "unknown"
  }

}