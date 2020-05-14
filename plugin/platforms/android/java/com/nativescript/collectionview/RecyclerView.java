package com.nativescript.collectionview;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.util.Log;

public class RecyclerView extends androidx.recyclerview.widget.RecyclerView {
    static final String TAG = "RecyclerView";
    public SizeChangedListener sizeChangedListener = null;
    public RecyclerView(Context context) {
        this(context, null);
    }
    public RecyclerView(Context context, android.util.AttributeSet attrs) {
        super(context, attrs);
        setHorizontalScrollBarEnabled(true);
        setVerticalScrollBarEnabled(true);
        setHasFixedSize(true);
        // setItemViewCacheSize(20);
        // setDrawingCacheEnabled(true);
        // setDrawingCacheQuality(View.DRAWING_CACHE_QUALITY_HIGH);
        setFocusable(true);
        setDescendantFocusability(ViewGroup.FOCUS_AFTER_DESCENDANTS);
    }

    static public RecyclerView createRecyclerView(Context context) {
        // long startTime = System.nanoTime();
        RecyclerView result = new RecyclerView(context);
        // Log.d(TAG, "createRecyclerView: " +  (System.nanoTime() - startTime)/1000000 + "ms");
        return result;
    }

    static public View inflate (Context context) {
            return  android.view.LayoutInflater.from(context).inflate(R.layout.collectionview, null, false);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        if (sizeChangedListener != null) {
            sizeChangedListener.onSizeChanged(w, h, oldw, oldh);
        }
    }
}