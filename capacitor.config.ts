import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gofarmwork.app',
  appName: 'GoFarmWork',
  webDir: 'dist',
  server: {
    url: 'https://gfwapk.pages.dev',
    cleartext: true
  }
};

export default config;
