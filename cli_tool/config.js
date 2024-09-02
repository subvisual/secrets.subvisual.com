import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const mode = process.env.NODE_ENV || 'development';

function buildApiUrl() {
  if (mode === 'development') {
    return 'http://localhost:4000';
  }

  const prNumber = process.env['REVIEW_ID'];

  if (prNumber) return `https://subvisual-secrets-pr-${prNumber}.herokuapp.com`;

  return `https://subvisual-secrets.herokuapp.com`;
}

const apiUrl = buildApiUrl();

export default {
  apiUrl,
};
