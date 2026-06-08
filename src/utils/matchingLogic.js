// TDC Matchmaker — Scoring Engine
// Returns a 0–100 compatibility score plus a category label and per-bucket breakdown.

// ---------------------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------------------

// Convert "12LPA" / "45 LPA" / 1500000 → 12 (in LPA, as a number)
const parseIncomeLPA = (val) => {
  if (val == null) return 0;
  if (typeof val === 'number') return val >= 1000 ? Math.round(val / 100000) : val;
  const cleaned = String(val).replace(/[, ]/g, '').toUpperCase();
  if (cleaned.endsWith('LPA')) return parseFloat(cleaned) || 0;
  if (cleaned.endsWith('CR') || cleaned.endsWith('CRORE')) return (parseFloat(cleaned) || 0) * 100;
  if (cleaned.endsWith('K')) return (parseFloat(cleaned) || 0) / 1000;
  const n = parseFloat(cleaned);
  if (isNaN(n)) return 0;
  return n >= 100000 ? Math.round(n / 100000) : n;
};

const norm = (v) => (v == null ? '' : String(v).trim().toLowerCase());
const eq = (a, b) => norm(a) === norm(b);

// Compatibility tables for kids preference
const kidsCompat = (a, b) => {
  if (!a || !b) return 0.3;
  if (eq(a, b)) return 1;
  if ((eq(a, 'yes') && eq(b, 'maybe')) || (eq(a, 'maybe') && eq(b, 'yes'))) return 0.7;
  if (eq(a, 'maybe') && eq(b, 'maybe')) return 0.8;
  if ((eq(a, 'no') && eq(b, 'maybe')) || (eq(a, 'maybe') && eq(b, 'no'))) return 0.3;
  return 0;
};

const relocateCompat = (a, b) => {
  if (!a || !b) return 0.3;
  if (eq(a, b)) return 1;
  if (eq(a, 'yes') && eq(b, 'maybe')) return 0.7;
  if (eq(a, 'maybe') && eq(b, 'yes')) return 0.7;
  if (eq(a, 'no') && eq(b, 'maybe')) return 0.3;
  if (eq(a, 'maybe') && eq(b, 'no')) return 0.3;
  return 0;
};

const petsCompat = (a, b) => {
  if (!a || !b) return 0.5;
  if (eq(a, b)) return 1;
  if (eq(a, 'yes') && eq(b, 'maybe')) return 0.7;
  if (eq(a, 'maybe') && eq(b, 'yes')) return 0.7;
  return 0.4;
};

const dietCompat = (a, b) => {
  if (!a || !b) return 0.5;
  if (eq(a, b)) return 1;
  if (eq(a, 'veg') && eq(b, 'eggetarian')) return 0.7;
  if (eq(a, 'eggetarian') && eq(b, 'veg')) return 0.7;
  if (eq(a, 'non-veg') && eq(b, 'eggetarian')) return 0.7;
  if (eq(a, 'eggetarian') && eq(b, 'non-veg')) return 0.7;
  return 0.3;
};

const drinkingCompat = (a, b) => {
  const rank = { no: 0, social: 1, yes: 2 };
  const ra = rank[norm(a)] ?? 0;
  const rb = rank[norm(b)] ?? 0;
  const diff = Math.abs(ra - rb);
  if (diff === 0) return 1;
  if (diff === 1) return 0.6;
  return 0.2;
};

const smokingCompat = (a, b) => {
  if (eq(a, b)) return 1;
  if ((eq(a, 'no') && eq(b, 'occasionally')) || (eq(a, 'occasionally') && eq(b, 'no'))) return 0.6;
  return 0.1;
};

const religionCompat = (a, b) => {
  if (!a || !b) return 0.4;
  return eq(a, b) ? 1 : 0.2;
};

const casteCompat = (a, b) => {
  if (!a || !b) return 0.5;
  if (eq(a, b)) return 1;
  if (eq(a, 'general') || eq(b, 'general') || eq(a, 'none') || eq(b, 'none')) return 0.6;
  return 0.3;
};

const familyTypeCompat = (a, b) => {
  if (!a || !b) return 0.5;
  return eq(a, b) ? 1 : 0.6;
};

// Profession stability score (0-1) — weight of profession beyond raw income
const professionScore = (prof) => {
  const p = norm(prof);
  if (!p) return 0.5;
  if (/(doctor|surgeon|specialist)/.test(p)) return 1;
  if (/(\bca\b|chartered accountant|cfa)/.test(p)) return 0.95;
  if (/(engineer|developer|architect|scientist|professor|researcher)/.test(p)) return 0.85;
  if (/(iim|xlri|isb|mba|product|manager|director|vp|head|lead)/.test(p)) return 0.9;
  if (/(entrepreneur|founder|startup)/.test(p)) return 0.75;
  if (/(lawyer|advocate|legal)/.test(p)) return 0.8;
  if (/(designer|architect|artist|creative)/.test(p)) return 0.7;
  if (/(teacher|lecturer|professor|education)/.test(p)) return 0.7;
  if (/(analyst|consultant)/.test(p)) return 0.75;
  return 0.6;
};

// ---------------------------------------------------------------------------
//  GENDER-SPECIFIC BUCKETS
// ---------------------------------------------------------------------------

// For MALE customer — match should be FEMALE, 1–5 years younger, shorter,
// equal or lower income.
const scoreCoreForMale = (cust, tgt) => {
  const ageDiff = (cust.age || 0) - (tgt.age || 0);
  // Age: ideal = 1-5 younger.  0 = out, 10 pts
  let agePts = 0;
  if (ageDiff >= 1 && ageDiff <= 5) agePts = 10;
  else if (ageDiff === 0) agePts = 4;
  else if (ageDiff > 5 && ageDiff <= 8) agePts = 6;
  else if (ageDiff < 0) agePts = 1; // older than customer (rare for male customer)
  // Height: female should be shorter (or close).  10 pts
  let heightPts = 0;
  const hDiff = (cust.height || 0) - (tgt.height || 0);
  if (hDiff >= 1 && hDiff <= 12) heightPts = 10;
  else if (hDiff > 12 && hDiff <= 20) heightPts = 6;
  else if (hDiff <= 0 && hDiff >= -5) heightPts = 6;
  else heightPts = 1;
  // Income: female should earn equal or less than male.  10 pts
  const ci = parseIncomeLPA(cust.income || cust.annualIncome);
  const ti = parseIncomeLPA(tgt.income || tgt.annualIncome);
  let incomePts = 0;
  if (ti <= ci) {
    const ratio = ci > 0 ? ti / ci : 1;
    if (ratio >= 0.7) incomePts = 10;
    else if (ratio >= 0.4) incomePts = 7;
    else incomePts = 4;
  } else {
    incomePts = 2; // she earns more — uncommon
  }
  return { agePts, heightPts, incomePts, total: agePts + heightPts + incomePts };
};

// For FEMALE customer — match should be MALE, 0–7 years older, taller,
// equal or higher income.
const scoreCoreForFemale = (cust, tgt) => {
  const ageDiff = (tgt.age || 0) - (cust.age || 0);
  let agePts = 0;
  if (ageDiff >= 0 && ageDiff <= 7) agePts = 10;
  else if (ageDiff > 7 && ageDiff <= 10) agePts = 6;
  else if (ageDiff < 0) agePts = 2;
  let heightPts = 0;
  const hDiff = (tgt.height || 0) - (cust.height || 0);
  if (hDiff >= 1 && hDiff <= 20) heightPts = 10;
  else if (hDiff > 20) heightPts = 6;
  else if (hDiff <= 0) heightPts = 1;
  const ci = parseIncomeLPA(cust.income || cust.annualIncome);
  const ti = parseIncomeLPA(tgt.income || tgt.annualIncome);
  let incomePts = 0;
  if (ti >= ci) {
    const ratio = ci > 0 ? ti / ci : 1;
    if (ratio >= 1 && ratio <= 3) incomePts = 10;
    else if (ratio > 3) incomePts = 7;
    else incomePts = 9;
  } else {
    incomePts = 2;
  }
  return { agePts, heightPts, incomePts, total: agePts + heightPts + incomePts };
};

// ---------------------------------------------------------------------------
//  MAIN SCORING FUNCTION
// ---------------------------------------------------------------------------

export const scoreMatch = (customer, target) => {
  const buckets = {
    core: { points: 0, max: 30, label: 'Core Compatibility', detail: {} },
    lifestyle: { points: 0, max: 20, label: 'Lifestyle Match', detail: {} },
    values: { points: 0, max: 25, label: 'Values Match', detail: {} },
    cultural: { points: 0, max: 15, label: 'Cultural Match', detail: {} },
    professional: { points: 0, max: 10, label: 'Professional Compatibility', detail: {} }
  };

  // 1. Core — age, height, income (30 pts)
  const core =
    customer.gender === 'male'
      ? scoreCoreForMale(customer, target)
      : scoreCoreForFemale(customer, target);
  buckets.core.points = core.total;
  buckets.core.detail = {
    age: `${customer.age} vs ${target.age} (${Math.abs((customer.age || 0) - (target.age || 0))} yr diff)`,
    height: `${customer.height}cm vs ${target.height}cm`,
    income: `${customer.income || customer.annualIncome || 'N/A'} vs ${target.income || 'N/A'}`
  };

  // 2. Lifestyle — diet, drinking, smoking (20 pts)
  const dietPts = Math.round(dietCompat(customer.diet, target.diet) * 7);
  const drinkPts = Math.round(drinkingCompat(customer.drinking, target.drinking) * 7);
  const smokePts = Math.round(smokingCompat(customer.smoking, target.smoking) * 6);
  buckets.lifestyle.points = dietPts + drinkPts + smokePts;
  buckets.lifestyle.detail = {
    diet: `${customer.diet} vs ${target.diet}`,
    drinking: `${customer.drinking} vs ${target.drinking}`,
    smoking: `${customer.smoking} vs ${target.smoking}`
  };

  // 3. Values — kids, relocate, pets (25 pts)
  const kidsPts = Math.round(kidsCompat(customer.wantKids, target.wantKids) * 10);
  const relPts = Math.round(relocateCompat(customer.openToRelocate, target.openToRelocate) * 8);
  const petsPts = Math.round(petsCompat(customer.openToPets, target.openToPets) * 7);
  buckets.values.points = kidsPts + relPts + petsPts;
  buckets.values.detail = {
    kids: `${customer.wantKids} vs ${target.wantKids}`,
    relocate: `${customer.openToRelocate} vs ${target.openToRelocate}`,
    pets: `${customer.openToPets} vs ${target.openToPets}`
  };

  // 4. Cultural — religion, caste, family type (15 pts)
  const relPtsC = Math.round(religionCompat(customer.religion, target.religion) * 6);
  const castePts = Math.round(casteCompat(customer.caste, target.caste) * 5);
  const famPts = Math.round(familyTypeCompat(customer.familyType, target.familyType) * 4);
  buckets.cultural.points = relPtsC + castePts + famPts;
  buckets.cultural.detail = {
    religion: `${customer.religion} vs ${target.religion}`,
    caste: `${customer.caste} vs ${target.caste}`,
    family: `${customer.familyType} vs ${target.familyType}`
  };

  // 5. Professional (10 pts) — stability + education tier alignment
  const pSelf = professionScore(customer.profession || customer.designation);
  const pTgt = professionScore(target.profession || target.designation);
  // both high → strong
  const profCompat = 1 - Math.abs(pSelf - pTgt);
  const buckets5 = Math.round(profCompat * 6);
  // education tier bonus (IIT/IIM/AIIMS vs same tier)
  const tier = (c) => {
    const s = norm(c);
    if (/(iit|aiims|iiit|bits|iisc|nid|nift|xlri|isb|xlr|nmims|srcc)/.test(s)) return 3;
    if (/(iim|nit|jadavpur|du|anna|osmania|madras|mit|vit)/.test(s)) return 2;
    return 1;
  };
  const eduBonus = tier(customer.college) === tier(target.college) ? 4 : 1;
  buckets.professional.points = buckets5 + eduBonus;
  buckets.professional.detail = {
    profession: `${customer.designation || customer.profession} vs ${target.profession || target.designation}`,
    college: `${customer.college} vs ${target.college}`
  };

  // Horoscope gate (does not add points; heavily penalises mismatch)
  if (eq(customer.horoscopeMatchRequired, 'yes') && eq(target.manglik, 'yes') && eq(customer.manglik, 'no')) {
    Object.values(buckets).forEach((b) => (b.points = Math.max(0, b.points - 2)));
  }

  const total = Object.values(buckets).reduce((s, b) => s + b.points, 0);
  return {
    score: Math.min(100, Math.round(total)),
    category: getMatchCategory(Math.min(100, Math.round(total))),
    buckets
  };
};

// ---------------------------------------------------------------------------
//  CATEGORY LABELS
// ---------------------------------------------------------------------------
export const getMatchCategory = (score) => {
  if (score >= 80) return 'High Potential';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Possible Fit';
  return 'Low Compatibility';
};

// ---------------------------------------------------------------------------
//  DASHBOARD FILTERS
// ---------------------------------------------------------------------------
export const filterCustomers = (
  customers,
  searchTerm = '',
  filterCity = '',
  filterStatus = '',
  filterGender = '',
  filterCaste = '',
  filterReligion = ''
) => {
  return customers.filter((c) => {
    const name = c.name || `${c.firstName || ''} ${c.lastName || ''}`;
    const matchesSearch =
      !searchTerm ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !filterCity || eq(c.city, filterCity);
    const matchesStatus = !filterStatus || c.status === filterStatus;
    const matchesGender = !filterGender || c.gender === filterGender;
    const matchesCaste = !filterCaste || eq(c.caste, filterCaste);
    const matchesReligion = !filterReligion || eq(c.religion, filterReligion);
    return matchesSearch && matchesCity && matchesStatus && matchesGender && matchesCaste && matchesReligion;
  });
};

// ---------------------------------------------------------------------------
//  PROFILE FILTER (match pool side)
// ---------------------------------------------------------------------------
export const filterProfiles = (profiles, { search = '', city = '', religion = '', caste = '', diet = '' }) => {
  return profiles.filter((p) => {
    const name = `${p.firstName || ''} ${p.lastName || ''}`;
    const matchesSearch =
      !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      (p.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.profession || '').toLowerCase().includes(search.toLowerCase());
    const matchesCity = !city || eq(p.city, city);
    const matchesReligion = !religion || eq(p.religion, religion);
    const matchesCaste = !caste || eq(p.caste, caste);
    const matchesDiet = !diet || eq(p.diet, diet);
    return matchesSearch && matchesCity && matchesReligion && matchesCaste && matchesDiet;
  });
};

// Compute the top N matches for a given customer.
export const getTopMatches = (customer, pool, topN = 10) => {
  const oppositeGender = customer.gender === 'male' ? 'female' : 'male';
  return pool
    .filter((p) => p.gender === oppositeGender)
    .map((p) => ({ ...p, ...scoreMatch(customer, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
};

export default {
  scoreMatch,
  getMatchCategory,
  filterCustomers,
  filterProfiles,
  getTopMatches
};
