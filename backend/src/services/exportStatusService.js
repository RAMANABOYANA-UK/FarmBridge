// Later this will fetch real DGFT / APEDA data
const MOCK_EXPORT_STATUS = {
  wheat: { allowed: false, note: 'Export restricted' },
  onion: { allowed: true, note: 'Open with conditions' },
  tomato: { allowed: true, note: 'Freely exportable' },
  rice: { allowed: true, note: 'Most varieties free' },
  potato: { allowed: true, note: 'Open' },
  mango: { allowed: true, note: 'Seasonal, quality critical' }
};

const getExportStatus = (cropName) => {
  const key = cropName.toLowerCase();
  return MOCK_EXPORT_STATUS[key] || { allowed: true, note: 'Status unknown – treat as open' };
};

const calculateExportReadiness = (product) => {
  const status = getExportStatus(product.name);
  let score = 0;
  const reasons = [];

  if (status.allowed) {
    score += 40;
  } else {
    reasons.push('Currently under export restriction');
  }

  if (product.qualityGrade?.grade === 'premium') {
    score += 40;
  } else if (product.qualityGrade?.grade === 'standard') {
    score += 20;
    reasons.push('Quality is standard, not premium');
  } else {
    reasons.push('Product not yet quality graded');
  }

  // Freshness bonus
  const hoursSinceHarvest = (Date.now() - new Date(product.harvestDate)) / (1000 * 60 * 60);
  if (hoursSinceHarvest < 24) score += 20;
  else if (hoursSinceHarvest < 48) score += 10;
  else reasons.push('Harvest is older than 48 hours');

  let finalStatus = 'unknown';
  if (score >= 70) finalStatus = 'ready';
  else if (!status.allowed) finalStatus = 'restricted';
  else finalStatus = 'not_ready';

  return { score, status: finalStatus, reasons };
};

module.exports = { getExportStatus, calculateExportReadiness };