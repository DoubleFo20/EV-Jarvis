package com.evjarvis.android.car;

import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.car.app.Screen;
import androidx.car.app.Session;

public final class EvJarvisSession extends Session {
    @Override
    @NonNull
    public Screen onCreateScreen(@NonNull Intent intent) {
        return new EvJarvisHomeScreen(getCarContext());
    }
}
