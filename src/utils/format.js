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
  const cur = currency || localStorage.getItem('currency') || 'USD';
  if (cur === 'ZWG') {
    return 'ZiG' + new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
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
