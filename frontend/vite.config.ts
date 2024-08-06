import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type UserConfig } from 'vite';

export default defineConfig(async ({ mode }) => {
  function buildApiUrl() {
    if (mode === 'development') {
      return 'http://localhost:5173';
    }

    const prNumber = process.env['REVIEW_ID'];

    if (prNumber) return `https://subvisual-secrets-pr-${prNumber}.herokuapp.com`;

    return `https://subvisual-secrets.herokuapp.com`;
  }

  const apiUrl = buildApiUrl();
  console.log('RUNNING WITH THE FOLLOWING API_URL', apiUrl);
  process.env.VITE_API_URL = apiUrl;

  const config: UserConfig = {
    plugins: [...await sveltekit()]
  };

  return config;
});
