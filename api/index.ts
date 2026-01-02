import { handle } from '@hono/node-server/vercel';
import { app } from '../src/app.ts';

export default handle(app);
