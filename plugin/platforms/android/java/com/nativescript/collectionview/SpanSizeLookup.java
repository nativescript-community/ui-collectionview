package com.nativescript.collectionview;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.GridLayoutManager;

public class SpanSizeLookup extends GridLayoutManager.SpanSizeLookup {
    public interface Interface {
        int getSpanSize(int position);
    }
    Interface inter = null;
    public void setInterface(Interface inter) {
        this.inter = inter;
    }

    public SpanSizeLookup(Interface inter) {
        super();
        setInterface(inter);
    }
    @Override
    public int getSpanSize(int position) {
        if (inter != null) {
            return inter.getSpanSize(position);
        }
        return 1;
    }
}
