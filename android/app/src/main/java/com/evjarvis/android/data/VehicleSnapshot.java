package com.evjarvis.android.data;

/**
 * User-entered/local vehicle state. It is deliberately not an OEM telemetry model.
 */
public final class VehicleSnapshot {
    private static final long STALE_AFTER_MILLIS = 15L * 60L * 1000L;

    private final String vehicleName;
    private final int socPercent;
    private final int rangeKm;
    private final String destination;
    private final long capturedAtMillis;
    private final String source;

    public VehicleSnapshot(
            String vehicleName,
            int socPercent,
            int rangeKm,
            String destination,
            long capturedAtMillis,
            String source) {
        this.vehicleName = vehicleName == null || vehicleName.trim().isEmpty()
                ? "EV vehicle (manual profile)"
                : vehicleName.trim();
        this.socPercent = Math.max(0, Math.min(100, socPercent));
        this.rangeKm = Math.max(0, rangeKm);
        this.destination = destination == null ? "" : destination.trim();
        this.capturedAtMillis = capturedAtMillis > 0 ? capturedAtMillis : System.currentTimeMillis();
        this.source = source == null || source.trim().isEmpty() ? "MANUAL_LOCAL" : source.trim();
    }

    public static VehicleSnapshot defaults() {
        return new VehicleSnapshot(
                "EV vehicle (manual profile)",
                50,
                200,
                "",
                System.currentTimeMillis(),
                "MANUAL_LOCAL");
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public int getSocPercent() {
        return socPercent;
    }

    public int getRangeKm() {
        return rangeKm;
    }

    public String getDestination() {
        return destination;
    }

    public long getCapturedAtMillis() {
        return capturedAtMillis;
    }

    public String getSource() {
        return source;
    }

    public String getFreshnessStatus() {
        return getFreshnessStatus(System.currentTimeMillis());
    }

    public String getFreshnessStatus(long nowMillis) {
        if (nowMillis < capturedAtMillis
                || nowMillis - capturedAtMillis > STALE_AFTER_MILLIS) {
            return "STALE";
        }
        return "CURRENT_LOCAL_ESTIMATE";
    }
}
