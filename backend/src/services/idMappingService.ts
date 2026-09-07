import CitizenIdMapping from '../models/CitizenIdMapping';

export const getRevenueIdForCitizen = async (welfareId: string): Promise<string | null> => {
  const mapping = await CitizenIdMapping.findOne({ welfareId, status: 'ACTIVE' });
  if (mapping) {
    return mapping.revenueId;
  }

  // Fallback default dynamic mapping for demo testing if seed missing
  if (welfareId.startsWith('CIT-')) {
    const numPart = welfareId.split('-')[1] || '1001';
    return `REV-${parseInt(numPart) + 6844}`;
  }

  return null;
};

export const getWelfareIdForRevenue = async (revenueId: string): Promise<string | null> => {
  const mapping = await CitizenIdMapping.findOne({ revenueId, status: 'ACTIVE' });
  return mapping ? mapping.welfareId : null;
};
