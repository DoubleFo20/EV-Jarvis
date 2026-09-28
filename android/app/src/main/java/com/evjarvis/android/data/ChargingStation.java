package com.evjarvis.android.data;

public final class ChargingStation {
    private final String name;
    private final String description;
    private final double latitude;
    private final double longitude;
    private final String source;
    private final String freshness;

    public ChargingStation(
            String name,
            String description,
            double latitude,
            double longitude,
            String source,
            String freshness) {
        this.name = name;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.source = source;
        this.freshness = freshness;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getSource() {
        return source;
    }

    public String getFreshness() {
        return freshness;
    }
}
