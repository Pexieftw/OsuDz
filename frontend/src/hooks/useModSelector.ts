import { useState } from 'react';
import { OSU_MODS } from '../utils/mods';

export const useModSelector = () => {
  const [selectedMods, setSelectedMods] = useState<string[]>([]);

  const toggleMod = (modValue: string) => {
    setSelectedMods(prev => {
      if (modValue === 'NM') {
        return [];
      }

      const mod = OSU_MODS.find(m => m.value === modValue);
      const incompatibleMods = mod?.incompatible || [];

      let filtered = prev.filter(m => m !== 'NM' && !incompatibleMods.includes(m));

      if (filtered.includes(modValue)) {
        const newMods = filtered.filter(m => m !== modValue);
        return newMods.length === 0 ? [] : newMods;
      }

      filtered = filtered.filter(m => {
        const existingMod = OSU_MODS.find(mod => mod.value === m);
        return !existingMod?.incompatible.includes(modValue);
      });

      return [...filtered, modValue];
    });
  };

  const isModDisabled = (modValue: string): boolean => {
    if (modValue === 'NM') return selectedMods.length > 0 && !selectedMods.includes('NM');
    if (selectedMods.length === 0 || selectedMods.includes('NM')) return false;

    const mod = OSU_MODS.find(m => m.value === modValue);
    if (!mod) return false;

    return selectedMods.some(selectedMod => mod.incompatible.includes(selectedMod));
  };

  const clearMods = () => setSelectedMods([]);

  return {
    selectedMods,
    toggleMod,
    isModDisabled,
    clearMods,
  };
};