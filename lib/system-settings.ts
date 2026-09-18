import { supabaseAdmin } from './supabase';

export interface MaintenanceModeSetting {
  enabled: boolean;
  message?: string;
  updated_at?: string;
  updated_by?: string;
}

const DEFAULT_MAINTENANCE_STATE: MaintenanceModeSetting = {
  enabled: false,
  message: 'Portal is currently under scheduled maintenance. Please check back shortly.',
};

// In-memory fallback in case table does not exist or connection fails
let inMemoryFallback: MaintenanceModeSetting = { ...DEFAULT_MAINTENANCE_STATE };

/**
 * Get the current maintenance mode status
 */
export async function getMaintenanceMode(): Promise<MaintenanceModeSetting> {
  try {
    const { data, error } = await supabaseAdmin
      .from('system_settings')
      .select('value, updated_at')
      .eq('key', 'maintenance_mode')
      .maybeSingle();

    if (error) {
      // Table might not be created yet; log gently and return fallback
      console.warn('Could not read maintenance_mode from database, using fallback:', error.message);
      return inMemoryFallback;
    }

    if (!data || !data.value) {
      return inMemoryFallback;
    }

    const val = data.value as MaintenanceModeSetting;
    return {
      enabled: Boolean(val.enabled),
      message: val.message || DEFAULT_MAINTENANCE_STATE.message,
      updated_at: data.updated_at || val.updated_at,
      updated_by: val.updated_by,
    };
  } catch (err: any) {
    console.error('Error fetching maintenance mode:', err);
    return inMemoryFallback;
  }
}

/**
 * Update the maintenance mode status in the database
 */
export async function setMaintenanceMode(
  enabled: boolean,
  message?: string,
  updatedBy?: string
): Promise<MaintenanceModeSetting> {
  const newSetting: MaintenanceModeSetting = {
    enabled,
    message: message || DEFAULT_MAINTENANCE_STATE.message,
    updated_at: new Date().toISOString(),
    updated_by: updatedBy || 'admin',
  };

  inMemoryFallback = { ...newSetting };

  try {
    const { error } = await supabaseAdmin
      .from('system_settings')
      .upsert(
        {
          key: 'maintenance_mode',
          value: newSetting,
          updated_at: newSetting.updated_at,
        },
        { onConflict: 'key' }
      );

    if (error) {
      console.warn('Failed to persist maintenance_mode to DB, updated in-memory:', error.message);
    }
  } catch (err: any) {
    console.error('Error updating maintenance mode in DB:', err);
  }

  return newSetting;
}
