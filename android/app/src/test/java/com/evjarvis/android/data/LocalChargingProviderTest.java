package com.evjarvis.android.data;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertEquals;

import org.junit.Test;

import java.util.List;

public final class LocalChargingProviderTest {
    @Test
    public void returnsExplicitlyUnverifiedFallbackStations() {
        ChargingSearchResult result = new LocalChargingProvider().search("Bangkok");
        List<ChargingStation> stations = result.getStations();

        assertFalse(stations.isEmpty());
        assertEquals(ChargingSearchResult.Status.SUCCESS, result.getStatus());
        assertEquals("DEMO_STATIC_FALLBACK", stations.get(0).getSource());
        assertEquals("UNVERIFIED_STATIC", stations.get(0).getFreshness());
    }
}
