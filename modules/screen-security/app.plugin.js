const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Expo config plugin for screen-security module
 * Adds DETECT_SCREEN_CAPTURE permission for screenshot detection on Android 14+
 */
const withScreenSecurity = (config) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest;

    // Add DETECT_SCREEN_CAPTURE permission if not already present
    if (!mainApplication['uses-permission']) {
      mainApplication['uses-permission'] = [];
    }

    const hasPermission = mainApplication['uses-permission'].some(
      (perm) => perm.$?.['android:name'] === 'android.permission.DETECT_SCREEN_CAPTURE'
    );

    if (!hasPermission) {
      mainApplication['uses-permission'].push({
        $: {
          'android:name': 'android.permission.DETECT_SCREEN_CAPTURE',
        },
      });
    }

    return config;
  });
};

module.exports = withScreenSecurity;
