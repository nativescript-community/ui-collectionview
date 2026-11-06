package com.nativescript.collectionview;

import androidx.recyclerview.widget.LinearSmoothScroller;
import android.content.Context;

public class SmoothScroller extends LinearSmoothScroller {

    /** the target is put in the middle of the list: not one of the LinearSmoothScroller's */
    public static final int SNAP_TO_CENTER = 2;

    public int snapPreference = LinearSmoothScroller.SNAP_TO_START;
    /** the scroll takes no time worth seeing: a scroll that is not animated, which is made with the same scroller so that it snaps the same */
    public boolean instant = false;

    public SmoothScroller(Context context) {
        super(context);
    }

    @Override protected int getVerticalSnapPreference() {
        return snapPreference;
    }
    @Override protected int getHorizontalSnapPreference() {
        return snapPreference;
    }

    @Override protected int calculateTimeForScrolling(int dx) {
        return instant ? 1 : super.calculateTimeForScrolling(dx);
    }
    @Override protected int calculateTimeForDeceleration(int dx) {
        return instant ? 1 : super.calculateTimeForDeceleration(dx);
    }

    @Override public int calculateDtToFit(int viewStart, int viewEnd, int boxStart, int boxEnd, int snapPreference) {
        if (snapPreference == SNAP_TO_CENTER) {
            return (boxStart + (boxEnd - boxStart) / 2) - (viewStart + (viewEnd - viewStart) / 2);
        }
        return super.calculateDtToFit(viewStart, viewEnd, boxStart, boxEnd, snapPreference);
    }

}
