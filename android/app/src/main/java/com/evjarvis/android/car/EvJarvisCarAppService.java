package com.evjarvis.android.car;

import androidx.annotation.NonNull;
import androidx.car.app.CarAppService;
import androidx.car.app.validation.HostValidator;
import androidx.car.app.Session;

/** Android Auto entry point for the approved POI category surface. */
public final class EvJarvisCarAppService extends CarAppService {
    @Override
    @NonNull
    public HostValidator createHostValidator() {
        // Local MVP/DHU bootstrap only. Restrict hosts before any public release.
        return HostValidator.ALLOW_ALL_HOSTS_VALIDATOR;
    }

    @Override
    @NonNull
    public Session onCreateSession() {
        return new EvJarvisSession();
    }
}
