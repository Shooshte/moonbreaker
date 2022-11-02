import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nrwl/cypress/plugins/cypress-preset';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export default defineConfig({
  e2e: nxE2EPreset(__dirname),
  env: {
    googleClientId: process.env.TEST_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.TEST_GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.TEST_GOOGLE_REFRESH_TOKEN,
  },
});
