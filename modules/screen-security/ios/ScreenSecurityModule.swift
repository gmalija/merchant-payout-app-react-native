import ExpoModulesCore
import UIKit
import LocalAuthentication

public class ScreenSecurityModule: Module {
  private var listenerCount: Int = 0
  private var isObserverRegistered: Bool = false

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ScreenSecurity')` in JavaScript.
    Name("ScreenSecurity")

    // Define events that can be sent to JavaScript
    Events("onScreenshotTaken")

    Function("getDeviceId") { () -> String in
      return getDeviceIdentifier()
    }

    AsyncFunction("isBiometricAuthenticated") { (promise: Promise) in
      self.authenticateWithBiometrics(promise: promise)
    }

    // Called when a JS listener subscribes to the event
    Function("startObservingScreenshots") { [weak self] () -> Void in
      guard let self = self else { return }
      self.incrementListenerCount()
    }

    // Called when a JS listener unsubscribes from the event
    Function("stopObservingScreenshots") { [weak self] () -> Void in
      guard let self = self else { return }
      self.decrementListenerCount()
    }

    OnDestroy {
      self.removeScreenshotDetection()
    }

  }

  private func getDeviceIdentifier() -> String {
    // Get identifierForVendor - unique per vendor (app developer)
    // This persists across app reinstalls, but resets if all apps from vendor are uninstalled
    if let identifierForVendor = UIDevice.current.identifierForVendor {
      return identifierForVendor.uuidString
    }

    // Fallback to random UUID if identifierForVendor is unavailable
    // This can happen in simulator or in edge cases
    return UUID().uuidString
  }

  private func authenticateWithBiometrics(promise: Promise) {

    let context = LAContext()
    var error: NSError?

    // Check if biometric authentication is available
    guard context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) else {
      // Biometrics not available or not enrolled
      if let err = error {
        switch err.code {
        case LAError.biometryNotEnrolled.rawValue:
          promise.reject("BIOMETRICS_NOT_ENROLLED", "Biometric authentication is not set up. Please enable Face ID or Touch ID in Settings.")
        case LAError.biometryNotAvailable.rawValue:
          promise.reject("BIOMETRICS_NOT_AVAILABLE", "Biometric authentication is not available on this device.")
        default:
          promise.reject("BIOMETRICS_ERROR", err.localizedDescription)
        }
      } else {
        promise.reject("BIOMETRICS_ERROR", "Biometric authentication is not available.")
      }
      return
    }

    // Authenticate with biometrics
    let reason = "Authenticate to confirm this payout"
    context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, error in
      DispatchQueue.main.async {
        if success {
          promise.resolve(true)
        } else {
          if let err = error as? LAError {
            switch err.code {
            case .userCancel, .systemCancel, .appCancel:
              promise.resolve(false)
            case .userFallback:
              promise.resolve(false)
            default:
              promise.reject("BIOMETRICS_AUTH_FAILED", err.localizedDescription)
            }
          } else {
            promise.resolve(false)
          }
        }
      }
    }

  }

  // MARK: - Screenshot Detection

  private func incrementListenerCount() {
    listenerCount += 1

    if listenerCount == 1 && !isObserverRegistered {
      setupScreenshotDetection()
    }
  }

  private func decrementListenerCount() {
    listenerCount = max(0, listenerCount - 1)

    if listenerCount == 0 && isObserverRegistered {
      removeScreenshotDetection()
    }
  }

  private func setupScreenshotDetection() {
    guard !isObserverRegistered else { return }

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(screenshotTaken),
      name: UIApplication.userDidTakeScreenshotNotification,
      object: nil
    )
    isObserverRegistered = true
  }

  private func removeScreenshotDetection() {
    guard isObserverRegistered else { return }

    NotificationCenter.default.removeObserver(
      self,
      name: UIApplication.userDidTakeScreenshotNotification,
      object: nil
    )
    isObserverRegistered = false
  }

  @objc private func screenshotTaken() {
    // Send event to JavaScript layer
    self.sendEvent("onScreenshotTaken", [:])
  }

}