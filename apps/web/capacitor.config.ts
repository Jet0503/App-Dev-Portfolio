import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.appgen.konza',
  appName: 'Konza',
  webDir: 'out',
  server: {
    url: 'https://findpro-74e8cc.appgen.co',
    cleartext: true,
  }
};
export default config;
