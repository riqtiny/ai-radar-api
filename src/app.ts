import { Hono } from 'hono';
import { websiteRoutes } from './routes/websites.ts';

const app = new Hono();

// Health check
app.get('/health', (c) =>
    c.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

// Routes
app.route('/websites', websiteRoutes);

// General error handler
app.onError((err, c) => {
    console.error(`App Error: ${err}`);
    return c.json(
        { error: 'Internal Server Error', message: err.message },
        500,
    );
});

export { app };
