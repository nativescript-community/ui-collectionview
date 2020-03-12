package com.nativescript.collectionview;

import android.content.Context;
import androidx.recyclerview.widget.RecyclerView;
import android.util.Log;

public class PreCachingGridLayoutManager extends GridLayoutManager {
    static final String TAG = "PreCachingGridLayoutManager";
    private int extraLayoutSpace = -1;

    public PreCachingGridLayoutManager(Context context, int spanCount) {
        super(context, spanCount);
    }


    public void setExtraLayoutSpace(int extraLayoutSpace) {
        this.extraLayoutSpace = extraLayoutSpace;
    }

    @Override
    protected void calculateExtraLayoutSpace(RecyclerView.State state, int[] extraLayoutSpace) {
        super.calculateExtraLayoutSpace(state, extraLayoutSpace);
        Log.d(TAG, "calculateExtraLayoutSpace: " + this.extraLayoutSpace);
        if (this.extraLayoutSpace > 0) {
            // if (getOrientation() == HORIZONTAL) {
                // extraLayoutSpace[0] = extraLayoutSpace[0] + this.extraLayoutSpace;
            // } else {
            extraLayoutSpace[0] = extraLayoutSpace[0] + this.extraLayoutSpace;
            extraLayoutSpace[1] = extraLayoutSpace[1] + this.extraLayoutSpace;
            // }
        }
    }
}