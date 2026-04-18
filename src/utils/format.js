import damImg from '../assets/images/dam.jpeg';
import tomatoImg from '../assets/images/Tomato.jpeg';
import tobaccoImg from '../assets/images/Tobacco_field.webp';
import maizeImg from '../assets/images/maize.jpeg';
import truckImg from '../assets/images/truck_with_crates.webp';
import workersImg from '../assets/images/workers.jpg';
import costImg from '../assets/images/cost.png';
import reportImg from '../assets/images/finacial_report.jpeg';
import hoursImg from '../assets/images/hours_and_pay.png';
import stockImg from '../assets/images/stock.jpg';
import teaImg from '../assets/images/tanganda-tea-farm-golden-hour-260nw-2470209317.jpg';

export const IMAGES = { dam: damImg, tomato: tomatoImg, tobacco: tobaccoImg, maize: maizeImg, truck: truckImg, workers: workersImg, cost: costImg, report: reportImg, hours: hoursImg, stock: stockImg, tea: teaImg };

/**
 * Hero images for the Dashboard — module-aware, tenant-neutral.
 * Sourced from Unsplash's free CDN. Each URL is fronted by a stable photo ID
 * and requests a 1600-wide variant — safe for hero banners. If a photo is
 * ever deprecated swap the ID here; no other file changes needed.
 */
export const HERO_IMAGES = {
  // Green farmland at golden hour — neutral, not tied to any region
  farm: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80&auto=format&fit=crop',
  // Bright, clean retail shop interior with stocked shelves
  retail: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&q=80&auto=format&fit=crop',
  // Fallback / neutral sunrise landscape for tenants with both modules
  neutral: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1600&q=80&auto=format&fit=crop',
  // Market-trip / logistics banner replacement
  logistics: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&q=80&auto=format&fit=crop',
  // Generic water / irrigation banner replacement
  water: 'https://images.unsplash.com/photo-1589995186011-a7b485edc4bf?w=1200&q=80&auto=format&fit=crop',
};

/**
 * Pick the right hero image for the current module.
 * Falls back to the neutral landscape if the caller passes something unknown.
 */
export function getHeroImage(activeModule) {
  if (activeModule === 'retail') return HERO_IMAGES.retail;
  if (activeModule === 'farm') return HERO_IMAGES.farm;
  return HERO_IMAGES.neutral;
}

export function cropImage(crop) {
  const c = (crop || '').toLowerCase();
  if (c.includes('tomato')) return tomatoImg;
  if (c.includes('tobacco')) return tobaccoImg;
  if (c.includes('maize') || c.includes('corn')) return maizeImg;
  return teaImg;
}

/**
 * Format number as currency.
 * Reads preferred currency from localStorage (default USD).
 */
export function fmt(n, currency) {
  if (n == null || isNaN(n)) return '—';
  const num = typeof n === 'string' ? parseFloat(n) : n;
  // Count actual decimal places in the original value — never round down
  const str = String(num);
  const dotIdx = str.indexOf('.');
  const actualDecimals = dotIdx >= 0 ? str.length - dotIdx - 1 : 0;
  const fractionDigits = Math.max(2, actualDecimals);
  const cur = currency || localStorage.getItem('currency') || 'USD';
  if (cur === 'ZWG') {
    return 'ZiG' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: fractionDigits,
    }).format(num);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  }).format(num);
}

/**
 * Format a quantity — strips trailing zeros.
 * qty(4.000) → "4", qty(3.500) → "3.5", qty(0.250) → "0.25"
 */
export function qty(n) {
  if (n == null || isNaN(n)) return '0';
  const num = typeof n === 'string' ? parseFloat(n) : n;
  return num.toString();
}

/** Today as YYYY-MM-DD */
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Crop emoji lookup */
export function cropEmoji(crop) {
  const map = {
    tomatoes: '🍅',
    maize: '🌽',
    tobacco: '🌿',
    vegetables: '🥬',
    other: '🌱',
  };
  return map[(crop || '').toLowerCase()] || '🌱';
}

/** Initials from name (max 2 chars) */
export function initials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

/** Avatar color palette */
export const avatarColors = [
  { bg: '#1a6b3a', text: '#ffffff' },
  { bg: '#0369a1', text: '#ffffff' },
  { bg: '#7c3aed', text: '#ffffff' },
  { bg: '#c97d1a', text: '#ffffff' },
  { bg: '#c0392b', text: '#ffffff' },
  { bg: '#374151', text: '#ffffff' },
];

export function avatarColor(name) {
  const idx = [...(name || '')].reduce((s, c) => s + c.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[idx];
}

/** Crop background gradients */
export function cropGradient(crop) {
  const map = {
    tomatoes: 'linear-gradient(135deg, #1a6b3a 0%, #2d9e58 100%)',
    tobacco: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
    maize: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
    vegetables: 'linear-gradient(135deg, #1a6b3a 0%, #2d9e58 100%)',
  };
  return map[(crop || '').toLowerCase()] || 'linear-gradient(135deg, #1a6b3a 0%, #2d9e58 100%)';
}
