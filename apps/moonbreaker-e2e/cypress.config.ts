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
    neo4jURI: process.env.NX_NE04J_TEST_URI,
    neo4jUser: process.env.NX_NE04J_TEST_USER,
    neo4jPass: process.env.NX_NEO4J_TEST_PASS,
    nextAuthJWTSecret: process.env.NEXTAUTH_SECRET,
  },
});
