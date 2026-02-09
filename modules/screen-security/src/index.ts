// Reexport the native module. On web, it will be resolved to ScreenSecurityModule.web.ts
// and on native platforms to ScreenSecurityModule.ts
export { default } from './ScreenSecurityModule';
export { default as ScreenSecurityView } from './ScreenSecurityView';
export * from  './ScreenSecurity.types';
