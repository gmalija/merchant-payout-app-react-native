package expo.modules.screensecurity

import android.content.Context
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import expo.modules.kotlin.Promise

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

    AsyncFunction("isBiometricAuthenticated") { promise: Promise ->
      authenticateWithBiometrics(promise)
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

  private fun authenticateWithBiometrics(promise: Promise) {
    val activity = appContext.currentActivity as? FragmentActivity
    if (activity == null) {
      promise.reject("ACTIVITY_NOT_AVAILABLE", "Activity is not available", null)
      return
    }

    // Check if biometric authentication is available
    val biometricManager = BiometricManager.from(context)
    when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG)) {
      BiometricManager.BIOMETRIC_SUCCESS -> {
        // Biometrics are available, proceed with authentication
      }
      BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
        promise.reject(
          "BIOMETRICS_NOT_ENROLLED",
          "Biometric authentication is not set up. Please enable fingerprint or face authentication in Settings.",
          null
        )
        return
      }
      BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> {
        promise.reject(
          "BIOMETRICS_NOT_AVAILABLE",
          "Biometric authentication is not available on this device.",
          null
        )
        return
      }
      BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> {
        promise.reject(
          "BIOMETRICS_NOT_AVAILABLE",
          "Biometric authentication is currently unavailable.",
          null
        )
        return
      }
      else -> {
        promise.reject(
          "BIOMETRICS_ERROR",
          "Biometric authentication is not available.",
          null
        )
        return
      }
    }

    // Create biometric prompt
    val executor = ContextCompat.getMainExecutor(context)
    val biometricPrompt = BiometricPrompt(
      activity,
      executor,
      object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
          super.onAuthenticationSucceeded(result)
          promise.resolve(true)
        }

        override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
          super.onAuthenticationError(errorCode, errString)
          when (errorCode) {
            BiometricPrompt.ERROR_USER_CANCELED,
            BiometricPrompt.ERROR_NEGATIVE_BUTTON,
            BiometricPrompt.ERROR_CANCELED -> {
              promise.resolve(false)
            }
            else -> {
              promise.reject("BIOMETRICS_AUTH_FAILED", errString.toString(), null)
            }
          }
        }

        override fun onAuthenticationFailed() {
          super.onAuthenticationFailed()
          // Authentication failed but user can retry
          // Don't resolve or reject here, let them try again
        }
      }
    )

    // Create prompt info
    val promptInfo = BiometricPrompt.PromptInfo.Builder()
      .setTitle("Authenticate")
      .setSubtitle("Authenticate to confirm this payout")
      .setNegativeButtonText("Cancel")
      .build()

    // Show biometric prompt
    activity.runOnUiThread {
      biometricPrompt.authenticate(promptInfo)
    }
  }

}