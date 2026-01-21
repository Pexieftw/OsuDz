import { type OsuMod } from "../types/beatmap";

export const OSU_MODS: OsuMod[] = [
  { value: 'NM', label: 'NoMod', description: 'No modifications', incompatible: [] },
  { value: 'EZ', label: 'Easy', description: 'Reduces difficulty', incompatible: ['HR'] },
  { value: 'NF', label: 'No Fail', description: "You can't fail", incompatible: ['SD', 'PF'] },
  { value: 'HT', label: 'Half Time', description: 'Slower gameplay', incompatible: ['DT', 'NC'] },
  { value: 'HR', label: 'Hard Rock', description: 'Everything just got harder', incompatible: ['EZ'] },
  { value: 'SD', label: 'Sudden Death', description: 'Miss and fail', incompatible: ['NF', 'PF'] },
  { value: 'PF', label: 'Perfect', description: 'SS or quit', incompatible: ['NF', 'SD'] },
  { value: 'DT', label: 'Double Time', description: 'Faster gameplay', incompatible: ['HT', 'NC'] },
  { value: 'NC', label: 'Nightcore', description: 'Pitch-shifted DT', incompatible: ['HT', 'DT'] },
  { value: 'HD', label: 'Hidden', description: 'Circles fade out', incompatible: [] },
  { value: 'FL', label: 'Flashlight', description: 'Restricted view', incompatible: [] },
  { value: 'SO', label: 'Spun Out', description: 'Auto-spin', incompatible: [] },
];