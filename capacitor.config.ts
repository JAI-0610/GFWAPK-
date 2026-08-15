import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gofarmwork.app',
  appName: 'GoFarmWork',
  webDir: 'dist',
  server: {
    url: 'https://gofarmwork.netlify.app',
    cleartext: true
  }
};

export default config;
