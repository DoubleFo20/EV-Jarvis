package com.evjarvis.android;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.InputType;
import android.util.TypedValue;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.evjarvis.android.data.LocalVehicleStore;
import com.evjarvis.android.data.VehicleSnapshot;

/** Phone-side manual/local vehicle and destination entry for the MVP. */
public final class MainActivity extends Activity {
    private EditText vehicleNameInput;
    private EditText socInput;
    private EditText rangeInput;
    private EditText destinationInput;
    private TextView statusView;
    private LocalVehicleStore vehicleStore;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        vehicleStore = new LocalVehicleStore(this);

        ScrollView scrollView = new ScrollView(this);
        LinearLayout content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        int padding = dp(20);
        content.setPadding(padding, padding, padding, padding);

        TextView title = new TextView(this);
        title.setText(R.string.phone_title);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 24);
        content.addView(title, fullWidth());

        TextView disclaimer = new TextView(this);
        disclaimer.setText(R.string.phone_disclaimer);
        disclaimer.setPadding(0, dp(8), 0, dp(16));
        content.addView(disclaimer, fullWidth());

        vehicleNameInput = textInput(getString(R.string.vehicle_profile_hint));
        socInput = numberInput(getString(R.string.manual_soc_hint));
        rangeInput = numberInput(getString(R.string.manual_range_hint));
        destinationInput = textInput(getString(R.string.destination_hint));
        content.addView(vehicleNameInput, fieldParams());
        content.addView(socInput, fieldParams());
        content.addView(rangeInput, fieldParams());
        content.addView(destinationInput, fieldParams());

        Button saveButton = new Button(this);
        saveButton.setText(R.string.save_local_state);
        saveButton.setOnClickListener(view -> saveState());
        content.addView(saveButton, fieldParams());

        Button conceptButton = new Button(this);
        conceptButton.setText(R.string.open_vehicle_concept);
        conceptButton.setOnClickListener(view ->
                startActivity(new Intent(this, VehicleConceptActivity.class)));
        content.addView(conceptButton, fieldParams());

        statusView = new TextView(this);
        content.addView(statusView, fullWidth());

        scrollView.addView(content);
        setContentView(scrollView);
        bind(vehicleStore.read());
    }

    private void saveState() {
        int soc = parseInt(socInput.getText().toString(), 0, 100, 50);
        int range = parseInt(rangeInput.getText().toString(), 0, 10000, 200);
        vehicleStore.save(
                vehicleNameInput.getText().toString(),
                soc,
                range,
                destinationInput.getText().toString());
        VehicleSnapshot snapshot = vehicleStore.read();
        bind(snapshot);
        Toast.makeText(this, R.string.saved_manual_local, Toast.LENGTH_SHORT).show();
    }

    private void bind(VehicleSnapshot snapshot) {
        vehicleNameInput.setText(snapshot.getVehicleName());
        socInput.setText(String.valueOf(snapshot.getSocPercent()));
        rangeInput.setText(String.valueOf(snapshot.getRangeKm()));
        destinationInput.setText(snapshot.getDestination());
        statusView.setText(getString(
                R.string.status_summary,
                snapshot.getSource(),
                snapshot.getFreshnessStatus(),
                snapshot.getCapturedAtMillis()));
    }

    private EditText textInput(String hint) {
        EditText input = new EditText(this);
        input.setHint(hint);
        input.setSingleLine(true);
        return input;
    }

    private EditText numberInput(String hint) {
        EditText input = textInput(hint);
        input.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
        return input;
    }

    private int parseInt(String value, int minimum, int maximum, int fallback) {
        try {
            int parsed = Integer.parseInt(value.trim());
            return Math.max(minimum, Math.min(maximum, parsed));
        } catch (NumberFormatException ignored) {
            return fallback;
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private LinearLayout.LayoutParams fieldParams() {
        return new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
    }

    private LinearLayout.LayoutParams fullWidth() {
        return fieldParams();
    }
}
