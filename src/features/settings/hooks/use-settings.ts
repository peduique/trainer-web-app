'use client';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface AppSettings {
  theme: 'light' | 'dark';
  measurementUnit: 'metric' | 'imperial';
  defaultRestSeconds: number;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  measurementUnit: 'metric',
  defaultRestSeconds: 60,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('app-settings', DEFAULT_SETTINGS);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, updateSetting };
}
