import React from 'react';
import { OSU_MODS } from '../../utils/mods';

interface ModSelectorProps {
  selectedMods: string[];
  onToggleMod: (modValue: string) => void;
  isModDisabled: (modValue: string) => boolean;
  onClearMods: () => void;
  calculatingMods: boolean;
}

const ModSelector: React.FC<ModSelectorProps> = ({
  selectedMods,
  onToggleMod,
  isModDisabled,
  onClearMods,
  calculatingMods,
}) => {
  return (
    <div>
      <label className="block text-text-primary font-medium mb-2">
        MOD COMBINATION{' '}
        {calculatingMods && <span className="text-text-muted text-sm">(calculating...)</span>}
      </label>
      <div className="bg-surface-dark border border-border-base rounded-lg p-3">
        <div className="flex flex-wrap gap-2">
          {OSU_MODS.map((mod) => {
            const isSelected =
              selectedMods.includes(mod.value) || (selectedMods.length === 0 && mod.value === 'NM');
            const isDisabled = isModDisabled(mod.value);

            return (
              <button
                key={mod.value}
                type="button"
                onClick={() => !isDisabled && onToggleMod(mod.value)}
                title={isDisabled ? 'Incompatible with selected mods' : mod.description}
                disabled={isDisabled}
                className={`px-3 py-1.5 rounded font-semibold text-sm transition-colors ${
                  isSelected
                    ? 'bg-accent-primary text-text-inverse'
                    : isDisabled
                    ? 'bg-surface-light text-text-muted cursor-not-allowed opacity-40'
                    : 'bg-surface-light text-text-secondary hover:bg-background-hover'
                }`}
              >
                {mod.value}
              </button>
            );
          })}
        </div>
        {selectedMods.length > 0 && (
          <button
            type="button"
            onClick={onClearMods}
            className="mt-3 w-full bg-error/20 hover:bg-error/30 text-error border border-error/40 py-2 rounded font-semibold text-sm transition-colors"
          >
            Clear All Mods
          </button>
        )}
      </div>
    </div>
  );
};

export default ModSelector;