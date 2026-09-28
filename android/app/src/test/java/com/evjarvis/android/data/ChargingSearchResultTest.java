package com.evjarvis.android.data;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public final class ChargingSearchResultTest {
    @Test
    public void preservesSafeUnavailableState() {
        ChargingSearchResult result = ChargingSearchResult.unavailable(
                "LOCAL_PROVIDER",
                "Provider unavailable; no charging data was returned.");

        assertEquals(ChargingSearchResult.Status.UNAVAILABLE, result.getStatus());
        assertTrue(result.getStations().isEmpty());
        assertEquals("UNAVAILABLE", result.getFreshness());
    }

    @Test
    public void preservesPartialStateWithStations() {
        ChargingStation station = new ChargingStation(
                "Partial stop", "Static partial result", 13.7, 100.5, "LOCAL", "STALE");

        ChargingSearchResult result = ChargingSearchResult.partial(
                java.util.Collections.singletonList(station),
                "LOCAL_PROVIDER",
                "STALE",
                "Some station data is unavailable.");

        assertEquals(ChargingSearchResult.Status.PARTIAL, result.getStatus());
        assertEquals(1, result.getStations().size());
        assertEquals("STALE", result.getFreshness());
    }
}
