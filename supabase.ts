import { createClient } from "@supabase/supabase-js";

const env = (import.meta as any).env || {};

const supabaseUrl = (env.VITE_SUPABASE_URL as string) || "https://isehhrtbccfllbnmocoy.supabase.co";
const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY as string) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZWhocnRiY2NmbGxibm1vY295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5OTI2MDAsImV4cCI6MjA4NDU2ODYwMH0.a3wD6scbjSqIj_d6PHquZcB7o6wKDd77HBwsZcNP4Kc";

if (!supabaseUrl || !supabaseAnonKey) {
	// Provide a clear runtime warning to help debugging missing env vars
	// (This will appear in the browser console.)
	// eslint-disable-next-line no-console
	console.warn("Supabase URL or anon key is missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createClient(supabaseUrl.trim(), supabaseAnonKey.trim());

// Diagnostic: attempt a lightweight fetch to help surface network / CORS errors
if (typeof window !== "undefined") {
	(async () => {
		try {
			const pingUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/`;
			const res = await fetch(pingUrl, { method: "GET" });
			// eslint-disable-next-line no-console
			console.log("Supabase ping:", { url: pingUrl, status: res.status, type: res.type });
			try {
				const text = await res.text();
				// eslint-disable-next-line no-console
				console.log("Supabase ping body (truncated):", text.slice(0, 200));
			} catch (_) {
				// ignore
			}
		} catch (err: any) {
			// eslint-disable-next-line no-console
			console.error("Supabase ping failed (network/CORS):", err && err.message ? err.message : err);
		}
	})();
}
