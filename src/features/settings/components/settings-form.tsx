'use client';
import { useSettings } from '@/features/settings/hooks/use-settings';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export function SettingsForm() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 font-semibold text-gray-900">Appearance</h3>
        <Select
          label="Theme"
          value={settings.theme}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
          onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark')}
        />
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-gray-900">Workout Preferences</h3>
        <div className="flex flex-col gap-4">
          <Select
            label="Measurement Units"
            value={settings.measurementUnit}
            options={[
              { value: 'metric', label: 'Metric (kg, km)' },
              { value: 'imperial', label: 'Imperial (lbs, miles)' },
            ]}
            onChange={(e) => updateSetting('measurementUnit', e.target.value as 'metric' | 'imperial')}
          />
          <Input
            label="Default Rest Timer (seconds)"
            type="number"
            min={10}
            max={300}
            value={settings.defaultRestSeconds}
            onChange={(e) => updateSetting('defaultRestSeconds', Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
