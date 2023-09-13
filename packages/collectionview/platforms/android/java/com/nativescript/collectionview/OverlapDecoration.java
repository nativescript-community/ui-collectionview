package com.nativescript.collectionview;
import androidx.recyclerview.widget.RecyclerView;
import android.view.View;
import android.graphics.Rect;

public class OverlapDecoration extends RecyclerView.ItemDecoration {

    public int top = 0;
    public int right = 0;
    public int bottom = 0;
    public int left = 0;

    @Override
    public void getItemOffsets (Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
        final int itemPosition = parent.getChildAdapterPosition(view);
        int position = parent.getChildAdapterPosition(view);
        boolean isLast = position == state.getItemCount()-1;
        if (itemPosition == 0) {
            return; }
        outRect.set(left, top, right, bottom);
    }
}