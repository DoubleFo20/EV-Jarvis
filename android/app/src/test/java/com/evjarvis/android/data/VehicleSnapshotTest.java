package com.evjarvis.android.data;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public final class VehicleSnapshotTest {
    @Test
    public void clampsManualValuesAndUsesSafeDefaults() {
        VehicleSnapshot snapshot = new VehicleSnapshot(null, 140, -5, null, 0, null);

        assertEquals("EV vehicle (manual profile)", snapshot.getVehicleName());
        assertEquals(100, snapshot.getSocPercent());
        assertEquals(0, snapshot.getRangeKm());
        assertEquals("", snapshot.getDestination());
        assertEquals("MANUAL_LOCAL", snapshot.getSource());
    }

    @Test
    public void exposesCurrentAndStaleLocalFreshnessStates() {
        VehicleSnapshot snapshot = new VehicleSnapshot("EV", 50, 200, "Bangkok", 1_000L, "MANUAL_LOCAL");

        assertEquals("CURRENT_LOCAL_ESTIMATE", snapshot.getFreshnessStatus(1_001L));
        assertEquals("STALE", snapshot.getFreshnessStatus(901_001L));
    }
}
