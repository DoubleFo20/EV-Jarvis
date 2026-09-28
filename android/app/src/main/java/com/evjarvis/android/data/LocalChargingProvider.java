package com.evjarvis.android.data;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Provider-agnostic development fallback. It never claims live availability or vehicle data.
 */
public final class LocalChargingProvider implements ChargingProvider {
    private static final String SOURCE = "DEMO_STATIC_FALLBACK";
    private static final String FRESHNESS = "UNVERIFIED_STATIC";

    @Override
    public ChargingSearchResult search(String destination) {
        List<ChargingStation> stations = Collections.unmodifiableList(Arrays.asList(
                new ChargingStation(
                        "EV-Jarvis demo stop A",
                        "Local demo POI • source: " + SOURCE + " • status: " + FRESHNESS,
                        13.7563,
                        100.5018,
                        SOURCE,
                        FRESHNESS),
                new ChargingStation(
                        "EV-Jarvis demo stop B",
                        "Local demo POI • source: " + SOURCE + " • status: " + FRESHNESS,
                        13.7460,
                        100.5340,
                        SOURCE,
                        FRESHNESS)));
        return ChargingSearchResult.success(
                stations,
                SOURCE,
                FRESHNESS,
                "Static fallback only; live station availability is unavailable.");
    }
}
