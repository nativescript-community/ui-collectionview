package com.nativescript.collectionview;

import android.content.Context;
import androidx.recyclerview.widget.RecyclerView;
import android.util.Log;
import android.view.View;
import java.util.HashMap;

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
        if (this.extraLayoutSpace > 0) {
            extraLayoutSpace[0] = extraLayoutSpace[0] + this.extraLayoutSpace;
            extraLayoutSpace[1] = extraLayoutSpace[1] + this.extraLayoutSpace;
        }
    }

    @Override
    public int computeVerticalScrollOffset(RecyclerView.State state) {
        // fixed computeVerticalScrollOffset
        View firstItemView = getChildAt(0);
        View lastItemView = getChildAt(getChildCount() - 1);

        int firstItem = getPosition(firstItemView);
        int lastItem = getPosition(lastItemView);
        int itemsBefore = firstItem;

        int laidOutArea = getDecoratedBottom(lastItemView) - getDecoratedTop(firstItemView);
        int itemRange = lastItem - firstItem + 1;
        float avgSizePerRow = (float) laidOutArea / itemRange;

        int offset = (int) (itemsBefore * avgSizePerRow + getPaddingTop() - getDecoratedTop(firstItemView));
        return offset;
    }
}