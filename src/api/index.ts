import env from "@/config";

const API_BASE_URL = env.API_BASE_URL;

if (!API_BASE_URL) {
    console.error("VITE_API_BASE_URL is not defined. Please set it in your environment variables.");
}

console.log(`API_BASE_URL: ${API_BASE_URL}`);
