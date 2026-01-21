export const calculateClockRate = (mods) => {
  if (mods.includes('DT') || mods.includes('NC')) {
    return 1.5;
  } else if (mods.includes('HT')) {
    return 0.75;
  }
  return 1.0;
};

export const calculateCS = (baseCS, mods) => {
  let cs = baseCS;
  if (mods.includes('HR')) {
    cs = Math.min(baseCS * 1.3, 10);
  } else if (mods.includes('EZ')) {
    cs = baseCS / 2;
  }
  return cs;
};

export const calculateOD = (greatHitWindow, baseOD) => {
  return greatHitWindow ? (80 - greatHitWindow) / 6 : baseOD;
};

export const calculateLength = (hitLength, clockRate) => {
  return hitLength ? Math.round(hitLength / clockRate) : null;
};

export const calculateModdedStats = (map, attrs, mods, hitLength) => {
  const clockRate = calculateClockRate(mods);
  const cs = calculateCS(map.cs, mods);
  const od = calculateOD(attrs.greatHitWindow, map.od);
  const length = calculateLength(hitLength, clockRate);

  return { clockRate, cs, od, length };
};