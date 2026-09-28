package com.evjarvis.android.data;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * Minimal local-first storage for the phone-side MVP. No network or OEM access is performed.
 */
public final class LocalVehicleStore {
    private static final String PREFERENCES = "ev_jarvis_vehicle_state";
    private static final String VEHICLE_NAME = "vehicle_name";
    private static final String SOC_PERCENT = "soc_percent";
    private static final String RANGE_KM = "range_km";
    private static final String DESTINATION = "destination";
    private static final String CAPTURED_AT = "captured_at";
    private static final String SOURCE = "source";

    private final SharedPreferences preferences;

    public LocalVehicleStore(Context context) {
        preferences = context.getApplicationContext()
                .getSharedPreferences(PREFERENCES, Context.MODE_PRIVATE);
    }

    public VehicleSnapshot read() {
        VehicleSnapshot defaults = VehicleSnapshot.defaults();
        return new VehicleSnapshot(
                preferences.getString(VEHICLE_NAME, defaults.getVehicleName()),
                preferences.getInt(SOC_PERCENT, defaults.getSocPercent()),
                preferences.getInt(RANGE_KM, defaults.getRangeKm()),
                preferences.getString(DESTINATION, defaults.getDestination()),
                preferences.getLong(CAPTURED_AT, defaults.getCapturedAtMillis()),
                preferences.getString(SOURCE, defaults.getSource()));
    }

    public void save(String vehicleName, int socPercent, int rangeKm, String destination) {
        preferences.edit()
                .putString(VEHICLE_NAME, vehicleName)
                .putInt(SOC_PERCENT, socPercent)
                .putInt(RANGE_KM, rangeKm)
                .putString(DESTINATION, destination)
                .putLong(CAPTURED_AT, System.currentTimeMillis())
                .putString(SOURCE, "MANUAL_LOCAL")
                .apply();
    }
}
