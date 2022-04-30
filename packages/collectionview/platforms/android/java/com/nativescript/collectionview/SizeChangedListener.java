package com.nativescript.collectionview;

public interface SizeChangedListener {
    public void onSizeChanged(int w, int h, int oldw, int oldh);
    public void onMeasure();
}