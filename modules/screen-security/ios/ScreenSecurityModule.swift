import ExpoModulesCore
import UIKit

public class ScreenSecurityModule: Module {
  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ScreenSecurity')` in JavaScript.
    Name("ScreenSecurity")

    // Defines constant property on the module.
    Constant("PI") {
      Double.pi
    }

    Function("getDeviceId") { () -> String in
      return getDeviceIdentifier()
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

}