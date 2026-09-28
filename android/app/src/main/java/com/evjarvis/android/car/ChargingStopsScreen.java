package com.evjarvis.android.car;

import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.car.app.CarContext;
import androidx.car.app.Screen;
import androidx.car.app.model.CarColor;
import androidx.car.app.model.CarLocation;
import androidx.car.app.model.ItemList;
import androidx.car.app.model.Metadata;
import androidx.car.app.model.Place;
import androidx.car.app.model.PlaceListMapTemplate;
import androidx.car.app.model.PlaceMarker;
import androidx.car.app.model.Row;
import androidx.car.app.model.Template;

import com.evjarvis.android.data.ChargingStation;
import com.evjarvis.android.data.ChargingProvider;
import com.evjarvis.android.data.ChargingSearchResult;
import com.evjarvis.android.data.LocalChargingProvider;

public final class ChargingStopsScreen extends Screen {
    private final String destination;
    private final ChargingProvider provider = new LocalChargingProvider();

    public ChargingStopsScreen(@NonNull CarContext carContext, String destination) {
        super(carContext);
        this.destination = destination == null ? "" : destination;
    }

    @Override
    @NonNull
    public Template onGetTemplate() {
        ItemList.Builder list = new ItemList.Builder();
        ChargingSearchResult result = provider.search(destination);
        list.addItem(new Row.Builder()
                .setTitle(result.getStatus().name())
                .addText(result.getMessage())
                .addText("Source: " + result.getSource() + " • freshness: " + result.getFreshness())
                .build());

        for (ChargingStation station : result.getStations()) {
            Place place = new Place.Builder(CarLocation.create(station.getLatitude(), station.getLongitude()))
                    .setMarker(new PlaceMarker.Builder()
                            .setLabel("EV")
                            .setColor(CarColor.BLUE)
                            .build())
                    .build();

            list.addItem(new Row.Builder()
                    .setTitle(station.getName())
                    .addText(station.getDescription())
                    .setMetadata(new Metadata.Builder().setPlace(place).build())
                    .setOnClickListener(() -> openNavigation(station))
                    .build());
        }

        return new PlaceListMapTemplate.Builder()
                .setTitle("Charging stops")
                .setHeaderAction(androidx.car.app.model.Action.BACK)
                .setItemList(list.build())
                .build();
    }

    private void openNavigation(ChargingStation station) {
        Uri uri = Uri.parse(
                "geo:" + station.getLatitude() + "," + station.getLongitude()
                        + "?q=" + Uri.encode(station.getName()));
        getCarContext().startCarApp(new Intent(CarContext.ACTION_NAVIGATE, uri));
    }
}
