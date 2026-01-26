import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { websiteRoutes } from './routes/websites.ts';

const app = new OpenAPIHono();

// Health check
app.get('/health', (c) =>
    c.json({ status: 'ok', timestamp: new Date().toISOString() }),
);

// Routes
app.route('/websites', websiteRoutes);

// OpenAPI JSON
app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'AI Radar API',
        description: 'API for tracking and reviewing AI-related websites.',
    },
});

// Scalar API Reference
app.get(
    '/reference',
    apiReference({
        spec: {
            url: '/doc',
        },
        theme: 'moon',
    } as any),
);

// General error handler
app.onError((err, c) => {
    console.error(`App Error: ${err}`);
    return c.json(
        { error: 'Internal Server Error', message: err.message },
        500,
    );
});

export { app };
