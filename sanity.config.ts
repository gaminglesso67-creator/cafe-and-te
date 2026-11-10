/**
 * Sanity Studio v3 Configuration for Saanjh — An Evening Full Of Flavours (Viman Nagar, Pune)
 * Run `npx sanity deploy` or connect your Sanity project in `.env.local`.
 */
import {
  SANITY_API_VERSION,
  SANITY_DATASET,
  SANITY_PROJECT_ID,
} from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';

export const sanityStudioConfig = {
  name: 'saanjh-viman-nagar-studio',
  title: 'Saanjh — Viman Nagar CMS & Operations Studio',
  projectId: SANITY_PROJECT_ID || 'your_sanity_project_id',
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  basePath: '/admin',
  schema: {
    types: schemaTypes,
  },
};

export default sanityStudioConfig;

