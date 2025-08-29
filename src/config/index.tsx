import { z } from "zod";

// Helper function to parse boolean from string
const booleanFromString = z
    .string()
    .default("false")
    .transform(val => val === "true");

// Define the raw environment variables schema (with VITE_ prefix)
const rawEnvSchema = z.object({
    // Vite environment variables (prefixed with VITE_)
    VITE_API_BASE_URL: z.string().url().default("http://localhost:3000"),
    VITE_APP_NAME: z.string().default("Zeroqu Prototype"),
    VITE_APP_VERSION: z.string().optional(),
    VITE_ENVIRONMENT: z.enum(["development", "staging", "production"]).default("development"),
    VITE_LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

    // Optional API keys and external service URLs
    VITE_API_KEY: z.string().optional(),
    VITE_AUTH_DOMAIN: z.string().optional(),
    VITE_DATABASE_URL: z.string().optional(),
    VITE_STORAGE_BUCKET: z.string().optional(),

    // Feature flags
    VITE_ENABLE_ANALYTICS: booleanFromString,
    VITE_ENABLE_THEME_TOGGLE: booleanFromString,

    // Development specific
    VITE_DEV_TOOLS: booleanFromString,
});

// Parse and validate environment variables
function parseEnv(): EnvConfig {
    try {
        const rawEnv = rawEnvSchema.parse(import.meta.env);

        // Remove VITE_ prefix from the returned object
        const cleanEnv = Object.keys(rawEnv).reduce(
            (acc, key) => {
                const cleanKey = key.startsWith("VITE_") ? key.substring(5) : key;
                acc[cleanKey] = rawEnv[key as keyof typeof rawEnv];
                return acc;
            },
            {} as Record<string, unknown>
        );

        return cleanEnv as EnvConfig;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const missingVars = error.issues
                .filter(
                    err =>
                        err.code === "invalid_type" &&
                        "received" in err &&
                        err.received === "undefined"
                )
                .map(err => err.path.join("."));

            const invalidVars = error.issues
                .filter(
                    err =>
                        !(
                            err.code === "invalid_type" &&
                            "received" in err &&
                            err.received === "undefined"
                        )
                )
                .map(err => `${err.path.join(".")}: ${err.message}`);

            let errorMessage = "Environment validation failed:\n";

            if (missingVars.length > 0) {
                errorMessage += `\nMissing required variables: ${missingVars.join(", ")}`;
            }

            if (invalidVars.length > 0) {
                errorMessage += `\nInvalid variables:\n${invalidVars.join("\n")}`;
            }

            console.error(errorMessage);
            console.error("Full validation errors:", error.issues);
            throw new Error(errorMessage);
        }
        throw error;
    }
}

// Export the validated environment configuration
const env = parseEnv();

export default env;

// Export the schema for testing purposes
export { rawEnvSchema };

// Export types
export type RawEnvConfig = z.infer<typeof rawEnvSchema>;

// Type for the cleaned environment (without VITE_ prefix)
export type EnvConfig = {
    API_BASE_URL: string;
    APP_NAME: string;
    APP_VERSION?: string;
    ENVIRONMENT: "development" | "staging" | "production";
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
    API_KEY?: string;
    AUTH_DOMAIN?: string;
    DATABASE_URL?: string;
    STORAGE_BUCKET?: string;
    ENABLE_ANALYTICS: boolean;
    ENABLE_THEME_TOGGLE: boolean;
    DEV_TOOLS: boolean;
};

// Helper functions for common environment checks
export const isDevelopment = env.ENVIRONMENT === "development";
export const isProduction = env.ENVIRONMENT === "production";
export const isStaging = env.ENVIRONMENT === "staging";

// API configuration
export const apiConfig = {
    baseURL: env.API_BASE_URL,
    apiKey: env.API_KEY,
    timeout: 10000, // 10 seconds
} as const;

// App configuration
export const appConfig = {
    name: env.APP_NAME,
    version: env.APP_VERSION,
    environment: env.ENVIRONMENT,
    features: {
        analytics: env.ENABLE_ANALYTICS,
        debug: env.LOG_LEVEL === "debug",
        themeToggle: env.ENABLE_THEME_TOGGLE,
        devTools: env.DEV_TOOLS,
    },
} as const;
