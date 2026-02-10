import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { websiteRoutes } from './routes/websites.ts';

const app = new OpenAPIHono();

// CORS Middleware
app.use('*', cors());

// Health check route definition
const healthRoute = createRoute({
    method: 'get',
    path: '/health',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.object({
                        status: z.string().openapi({ example: 'ok' }),
                        timestamp: z.string().openapi({ example: '2023-10-27T10:00:00.000Z' }),
                    }),
                },
            },
            description: 'Returns the service health status',
        },
    },
    tags: ['System'],
    summary: 'Service health check',
    operationId: 'getHealth',
});

// Health check implementation
app.openapi(healthRoute, (c) =>
    c.json({ status: 'ok', timestamp: new Date().toISOString() }, 200),
);

// Routes
app.route('/websites', websiteRoutes);

// OpenAPI JSON
app.doc('/doc', {
    openapi: '3.1.0',
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
        url: '/doc',
        theme: 'moon',
    }),
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
