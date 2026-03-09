'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '@/features/settings/hooks/use-settings';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SettingsForm() {
  const { settings, setSettings } = useSettings();
  const [formState, setFormState] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormState(settings);
  }, [settings]);

  const update = <K extends keyof typeof formState>(key: K, value: (typeof formState)[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSettings(formState);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.dispatchEvent(new CustomEvent('theme-change', { detail: formState.theme }));
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground">Appearance</h3>
        <Select
          label="Theme"
          value={formState.theme}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
          onChange={(e) => update('theme', e.target.value as 'light' | 'dark')}
        />
      </section>

      <section className="flex flex-col gap-4 border-t border-border pt-8">
        <h3 className="text-sm font-semibold text-foreground">Workout Preferences</h3>
        <div className="flex flex-col gap-4">
          <Select
            label="Measurement Units"
            value={formState.measurementUnit}
            options={[
              { value: 'metric', label: 'Metric (kg, km)' },
              { value: 'imperial', label: 'Imperial (lbs, miles)' },
            ]}
            onChange={(e) => update('measurementUnit', e.target.value as 'metric' | 'imperial')}
          />
          <Input
            label="Default Rest Timer (seconds)"
            type="number"
            min={10}
            max={300}
            value={formState.defaultRestSeconds}
            onChange={(e) => update('defaultRestSeconds', Number(e.target.value))}
          />
        </div>
      </section>

      <div className="flex items-center gap-3 border-t border-border pt-8">
        <Button onClick={handleSave}>Save</Button>
        {saved && <span className="text-sm text-muted-foreground">Saved.</span>}
      </div>
    </div>
  );
}
