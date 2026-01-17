// /**
//  * API Base URL Configuration
//  * 
//  * HARDCODED: Production API endpoint is hardcoded to ensure reliability.
//  * 
//  * Production: https://api.eventcoresolutions.com (HARDCODED)
//  * Development: http://localhost:8080
//  * 
//  * NOTE: Next.js bakes NEXT_PUBLIC_* vars into the JavaScript bundle at BUILD time.
//  * To avoid issues with missing env vars, we hardcode the production API URL.
//  */
// // #region agent log
// let API_BASE_URL: string;
// if (typeof window !== 'undefined') {
//   const hostname = window.location.hostname;
//   const isProductionDomain = hostname.includes('eventcoresolutions.com') && !hostname.startsWith('api.');
  
//   // HARDCODED: Always use production API when on production domain
//   if (isProductionDomain) {
//     API_BASE_URL = 'https://api.eventcoresolutions.com';
//     fetch('http://127.0.0.1:7243/ingest/aa2d84d5-6e92-4459-b2f4-c84a33852b00',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiConfig.ts:18',message:'HARDCODED: Using production API',data:{apiBaseUrl:API_BASE_URL,hostname:hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'A'})}).catch(()=>{});
//   } else {
//     // Development: use env var or localhost fallback
//     API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
//     fetch('http://127.0.0.1:7243/ingest/aa2d84d5-6e92-4459-b2f4-c84a33852b00',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiConfig.ts:23',message:'Development: Using env var or localhost',data:{apiBaseUrl:API_BASE_URL,envVar:process.env.NEXT_PUBLIC_API_BASE_URL,hostname:hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'A'})}).catch(()=>{});
//   }
  
//   // Final validation: ensure API_BASE_URL is always a valid absolute URL
//   if (!API_BASE_URL || API_BASE_URL === '/' || API_BASE_URL === '' || (!API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://'))) {
//     // Last resort: hardcode production API if on production domain
//     API_BASE_URL = isProductionDomain ? 'https://api.eventcoresolutions.com' : 'http://localhost:8080';
//     fetch('http://127.0.0.1:7243/ingest/aa2d84d5-6e92-4459-b2f4-c84a33852b00',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiConfig.ts:29',message:'CRITICAL: Last resort hardcoded fallback',data:{apiBaseUrl:API_BASE_URL,hostname:hostname},timestamp:Date.now(),sessionId:'debug-session',runId:'run3',hypothesisId:'A'})}).catch(()=>{});
//     console.error('[API Config] CRITICAL: Applied hardcoded fallback!', {
//       apiBaseUrl: API_BASE_URL,
//       hostname: hostname
//     });
//   }
  
//   // Log the final value being used
//   console.log('[API Config] Final API_BASE_URL (HARDCODED for production):', API_BASE_URL);
//   console.log('[API Config] Current hostname:', hostname);
// } else {
//   // SSR: use env var or default
//   API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080').replace(/\/+$/, '');
// }
// // #endregion

// export { API_BASE_URL };

// Using localhost backend for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8086";

