package com.evjarvis.android.car;

import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.car.app.CarContext;
import androidx.car.app.CarToast;
import androidx.car.app.Screen;
import androidx.car.app.model.ItemList;
import androidx.car.app.model.ListTemplate;
import androidx.car.app.model.Row;
import androidx.car.app.model.Template;

import com.evjarvis.android.data.LocalVehicleStore;
import com.evjarvis.android.data.VehicleSnapshot;

public final class EvJarvisHomeScreen extends Screen {
    private final LocalVehicleStore vehicleStore;

    public EvJarvisHomeScreen(@NonNull CarContext carContext) {
        super(carContext);
        vehicleStore = new LocalVehicleStore(carContext);
    }

    @Override
    @NonNull
    public Template onGetTemplate() {
        VehicleSnapshot snapshot = vehicleStore.read();
        ItemList list = new ItemList.Builder()
                .addItem(new Row.Builder()
                        .setTitle(snapshot.getVehicleName())
                        .addText("SOC " + snapshot.getSocPercent() + "% • range " + snapshot.getRangeKm() + " km")
                        .addText("Source: " + snapshot.getSource()
                                + " • " + snapshot.getFreshnessStatus()
                                + " • captured: " + snapshot.getCapturedAtMillis())
                        .build())
                .addItem(new Row.Builder()
                        .setTitle("Charging discovery")
                        .addText("Static fallback POIs with explicit stale/unverified state")
                        .setOnClickListener(() -> getScreenManager().push(
                                new ChargingStopsScreen(getCarContext(), snapshot.getDestination())))
                        .build())
                .addItem(new Row.Builder()
                        .setTitle("Open destination navigation")
                        .addText(snapshot.getDestination().trim().isEmpty()
                                ? "Set a destination on the phone first"
                                : snapshot.getDestination())
                        .setOnClickListener(() -> openNavigation(snapshot.getDestination()))
                        .build())
                .build();

        return new ListTemplate.Builder()
                .setTitle("EV-Jarvis")
                .setSingleList(list)
                .build();
    }

    private void openNavigation(String destination) {
        if (destination == null || destination.trim().isEmpty()) {
            CarToast.makeText(getCarContext(), "Set a destination on the phone first", CarToast.LENGTH_SHORT)
                    .show();
            return;
        }
        Uri uri = Uri.parse("geo:0,0?q=" + Uri.encode(destination));
        getCarContext().startCarApp(new Intent(CarContext.ACTION_NAVIGATE, uri));
    }
}
