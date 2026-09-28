package com.evjarvis.android;

import android.app.Activity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/** Phone-only preview of an unofficial S05 visual approximation based on Owner-supplied references. */
public final class VehicleConceptActivity extends Activity {
    private VehicleVisualConceptView modelView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        LinearLayout content = new LinearLayout(this);
        content.setOrientation(LinearLayout.VERTICAL);
        int padding = Math.round(20 * getResources().getDisplayMetrics().density);
        content.setPadding(padding, padding, padding, padding);

        Button back = new Button(this);
        back.setText(R.string.concept_back);
        back.setOnClickListener(view -> finish());
        content.addView(back, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        TextView title = new TextView(this);
        title.setText(R.string.concept_title);
        title.setTextSize(24);
        content.addView(title);

        TextView disclaimer = new TextView(this);
        disclaimer.setText(R.string.concept_disclaimer);
        disclaimer.setPadding(0, padding / 2, 0, padding / 2);
        content.addView(disclaimer);

        modelView = new VehicleVisualConceptView(this);
        modelView.setContentDescription(getString(R.string.concept_title));
        content.addView(modelView, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        TextView hint = new TextView(this);
        hint.setText(R.string.concept_interaction_hint);
        hint.setGravity(Gravity.CENTER);
        content.addView(hint);
        setContentView(content);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (modelView != null) modelView.onResume();
    }

    @Override
    protected void onPause() {
        if (modelView != null) modelView.onPause();
        super.onPause();
    }
}
