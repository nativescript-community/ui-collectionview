package com.nativescript.collectionview;

import android.content.Context;
import androidx.recyclerview.widget.RecyclerView;
import android.view.View;
import java.util.HashMap;

public class GridLayoutManager extends androidx.recyclerview.widget.GridLayoutManager {
    private HashMap<Integer, Integer> childSizesMap = new HashMap();
    public boolean isScrollEnabled = true;

    public GridLayoutManager(Context context, int spanCount) {
        super(context, spanCount);
        setSmoothScrollbarEnabled(true);
    }

    public void  onLayoutCompleted(RecyclerView.State state) {
        super.onLayoutCompleted(state);
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            childSizesMap.put(getPosition(child), child.getHeight());
        }
    }

   public  int computeVerticalScrollOffset(RecyclerView.State state) {
        if (getChildCount() == 0) {
            return 0;
        }
        final int firstChildPosition = findFirstVisibleItemPosition();
        final View firstChild = findViewByPosition(firstChildPosition);
        if (firstChild == null) {
            return 0;
        }
        float scrolledY = -firstChild.getY();
        for (int i = 0; i < firstChildPosition; i++) {
            if (childSizesMap.get(i) != null) {
                scrolledY += childSizesMap.get(i) ;
            }
        }
        return Math.round(scrolledY);
    }

    public void setScrollEnabled(boolean value) {
         isScrollEnabled = value;
    }
    public boolean canScrollVertically() {

        return isScrollEnabled && super.canScrollVertically();
    }
    public boolean canScrollHorizontally() {
  
        return isScrollEnabled && super.canScrollHorizontally();
    }

    // computeScrollVectorForPosition( targetPosition) {
    //     if (this.getChildCount() == 0) {
    //         return null;
    //     }
    //     const firstChildPos = this.getPosition(this.getChildAt(0));
    //     const direction = targetPosition < firstChildPos != this.getReverseLayout()
    //             ? 1 : -1;
    //     if (this.getOrientation() == HORIZONTAL) {
    //         return new PointF(direction, 0);
    //     } else {
    //         return new PointF(0, direction);
    //     }
    // }

    // public supportsPredictiveItemAnimations() {
    //     return false;
    // }
}