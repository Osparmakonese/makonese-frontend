/**
 * Analytics wrapper — Phase 15.
 *
 * PostHog integration. No-op until REACT_APP_POSTHOG_KEY is set.
 * Usage:
 *   import { track, identify } from '../utils/analytics';
 *   track('plan_upgraded', { plan: 'growth', cycle: 'monthly' });
 *   identify(userId, { email, role, tenant });
 */

const POSTHOG_KEY = process.env.REACT_APP_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.REACT_APP_POSTHOG_HOST || 'https://us.i.posthog.com';

let _posthog = null;

async function _getPostHog() {
  if (_posthog) return _posthog;
  if (!POSTHOG_KEY) return null;
  try {
    const { default: posthog } = await import('posthog-js');
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: true,
      capture_pageview: true,
      persistence: 'memory', // no localStorage per Pewil privacy stance
    });
    _posthog = posthog;
    return posthog;
  } catch {
    return null;
  }
}

export async function track(event, properties = {}) {
  const ph = await _getPostHog();
  if (ph) ph.capture(event, properties);
}

export async function identify(userId, traits = {}) {
  const ph = await _getPostHog();
  if (ph) ph.identify(String(userId), traits);
}

export async function reset() {
  const ph = await _getPostHog();
  if (ph) ph.reset();
}

// Page view — call on route change
export async function pageView(path) {
  const ph = await _getPostHog();
  if (ph) ph.capture('$pageview', { $current_url: path });
}
