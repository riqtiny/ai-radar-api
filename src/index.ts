import { app } from './app.ts';
import { CONFIG } from './config/env.ts';

console.log(`AI Radar API starting on port ${CONFIG.PORT}...`);

export default {
    port: CONFIG.PORT,
    fetch: app.fetch,
};
