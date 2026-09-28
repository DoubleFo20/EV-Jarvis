package com.evjarvis.android.data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** Normalized charging discovery result independent of a named provider. */
public final class ChargingSearchResult {
    public enum Status {
        SUCCESS,
        PARTIAL,
        EMPTY,
        UNAVAILABLE
    }

    private final Status status;
    private final List<ChargingStation> stations;
    private final String source;
    private final String freshness;
    private final String message;

    private ChargingSearchResult(
            Status status,
            List<ChargingStation> stations,
            String source,
            String freshness,
            String message) {
        this.status = status == null ? Status.UNAVAILABLE : status;
        this.stations = Collections.unmodifiableList(
                new ArrayList<>(stations == null ? Collections.emptyList() : stations));
        this.source = safe(source, "UNKNOWN");
        this.freshness = safe(freshness, "UNKNOWN");
        this.message = safe(message, "Charging data is unavailable.");
    }

    public static ChargingSearchResult success(
            List<ChargingStation> stations,
            String source,
            String freshness,
            String message) {
        return new ChargingSearchResult(Status.SUCCESS, stations, source, freshness, message);
    }

    public static ChargingSearchResult partial(
            List<ChargingStation> stations,
            String source,
            String freshness,
            String message) {
        return new ChargingSearchResult(Status.PARTIAL, stations, source, freshness, message);
    }

    public static ChargingSearchResult empty(
            String source,
            String freshness,
            String message) {
        return new ChargingSearchResult(Status.EMPTY, Collections.emptyList(), source, freshness, message);
    }

    public static ChargingSearchResult unavailable(String source, String message) {
        return new ChargingSearchResult(Status.UNAVAILABLE, Collections.emptyList(), source, "UNAVAILABLE", message);
    }

    public Status getStatus() {
        return status;
    }

    public List<ChargingStation> getStations() {
        return stations;
    }

    public String getSource() {
        return source;
    }

    public String getFreshness() {
        return freshness;
    }

    public String getMessage() {
        return message;
    }

    private static String safe(String value, String fallback) {
        return value == null || value.trim().isEmpty() ? fallback : value.trim();
    }
}
