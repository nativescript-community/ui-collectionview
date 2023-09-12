package com.nativescript.collectionview;

import androidx.recyclerview.widget.LinearSmoothScroller;
import android.content.Context;

public class SmoothScroller extends LinearSmoothScroller {

    public int snapPreference = LinearSmoothScroller.SNAP_TO_START;

    public SmoothScroller(Context context) {
        super(context);
    }

    @Override protected int getVerticalSnapPreference() {
        return snapPreference;
    }
    @Override protected int getHorizontalSnapPreference() {
        return snapPreference;
    }

}