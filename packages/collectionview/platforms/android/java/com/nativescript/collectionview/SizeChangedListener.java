package com.nativescript.collectionview;

public interface SizeChangedListener {
    // public void onSizeChanged(int w, int h, int oldw, int oldh);
    public void onLayout(boolean changed, int l, int t, int r, int b);
    public void onMeasure(int widthMeasureSpec, int heightMeasureSpec);
}