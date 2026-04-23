// DEPRECATED 2026-04-23
// This file used to be a designer mockup with hardcoded SAMPLE_INVOICES and
// dead "Upgrade Plan" / "Update Payment" buttons — shipped to prod by mistake.
// New-tenant users saw three phantom $10 PAID invoices for Feb/Mar/Apr 2026
// that belonged to nobody, and clicking Upgrade did nothing.
// Now re-exports the real Billing component so any lingering import keeps
// working. The sidebar's 'Retail Billing' key is routed directly to Billing
// in App.js — this file is only kept to avoid breaking stale imports.
export { default } from './Billing';
