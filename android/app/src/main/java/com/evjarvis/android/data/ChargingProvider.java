package com.evjarvis.android.data;

/** Provider boundary for charging discovery; implementations must expose safe result states. */
public interface ChargingProvider {
    ChargingSearchResult search(String destination);
}
