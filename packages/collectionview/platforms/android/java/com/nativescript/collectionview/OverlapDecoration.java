package com.nativescript.collectionview;
import androidx.recyclerview.widget.RecyclerView;
import android.view.View;
import android.graphics.Rect;

public class OverlapDecoration extends RecyclerView.ItemDecoration {

    public OverlapDecorationListener listener;

    public interface OverlapDecorationListener {
        public java.nio.FloatBuffer getItemOverlap(int position);
    }

    public OverlapDecoration(OverlapDecorationListener listener) {
        super();
        this.listener = listener;
    }

    @Override
    public void getItemOffsets (Rect outRect, View view, RecyclerView parent, RecyclerView.State state) {
        int position = parent.getChildAdapterPosition(view);
        boolean isLast = position == state.getItemCount()-1;
        java.nio.FloatBuffer buffer = listener.getItemOverlap(position);
        outRect.set((int)buffer.get(3), (int)buffer.get(0), (int)buffer.get(1), (int)buffer.get(2));
    }
}