import { CONFIG } from '../config/env.ts';
import { WebsiteSchema, type Website } from '../types/website.ts';

export async function fetchWebsites(): Promise<Website[]> {
    try {
        const response = await fetch(CONFIG.TARGET_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const html = await response.text();

        // Extract the content of const websites = [...] from the HTML
        // Looking for something like: const websites = [{...}, {...}];
        const regex = /const\s+websites\s*=\s*(\[[\s\S]*?\]);/m;
        const match = html.match(regex);

        if (!match || !match[1]) {
            throw new Error('Could not find websites data in the response');
        }

        const rawData = match[1];

        // Using a more lenient evaluation since it's a JS object literal string, not strictly JSON
        // However, for safety in this specific context, we'll try to transform it to valid JSON
        // or use a safe evaluation if we're confident in the source.
        // In many cases ai-radar's data might be valid JSON or close to it.
        // We'll try to parse it. If it fails due to unquoted keys or single quotes, we'll handle it.

        let parsedData: any[];
        try {
            // Try standard JSON first
            parsedData = JSON.parse(rawData);
        } catch {
            // If it's a JS object literal, it might have unquoted keys or single quotes
            // We can use a simple transformation or eval (safely-ish in a backend scraper)
            // For a production scraper, a more robust parser would be better.
            // Here we'll try a common hack: wrap in quotes and swap quotes if needed
            // But safer to just use a custom regex or a parser library like 'eval' or 'json5' if allowed.
            // Since we want minimal deps, let's try to clean it up.

            try {
                // Simple cleanup for common JS-literal-to-JSON issues:
                // 1. Swap single quotes to double quotes (risky with nested quotes but common)
                // 2. Quote unquoted keys (e.g. hostname: -> "hostname":)
                const cleaned = rawData
                    .replace(/'/g, '"') // Replace single quotes with double quotes
                    .replace(/(\w+):/g, '"$1":') // Quote keys
                    .replace(/,\s*]/g, ']'); // Remove trailing commas
                parsedData = JSON.parse(cleaned);
            } catch (e) {
                throw new Error(
                    `Failed to parse websites data: ${
                        e instanceof Error ? e.message : 'Unknown error'
                    }`,
                );
            }
        }

        // Validate with Zod
        const validated = z.array(WebsiteSchema).safeParse(parsedData);
        if (!validated.success) {
            throw new Error(
                `Data validation failed: ${validated.error.message}`,
            );
        }

        return validated.data;
    } catch (error) {
        console.error('Scraper Error:', error);
        throw error;
    }
}

import { z } from 'zod';
