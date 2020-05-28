package com.nativescript.collectionview;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

public class OnScrollListener extends RecyclerView.OnScrollListener {
    public interface Listener {
        void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy);
        void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState);
    }
    Listener listener = null;
    public void setListener(Listener listener) {
        this.listener = listener;
    }

    public OnScrollListener(Listener listener) {
        super();
        setListener(listener);
    }
    @Override
    public void onScrolled(@NonNull RecyclerView recyclerView, int dx, int dy) {
        if (listener != null) {
            listener.onScrolled(recyclerView, dx, dy);
        }
        super.onScrolled(recyclerView, dx, dy);
    }

    @Override
    public void onScrollStateChanged(@NonNull RecyclerView recyclerView, int newState) {
        if (listener != null) {
            listener.onScrollStateChanged(recyclerView, newState);
        }
        super.onScrollStateChanged(recyclerView, newState);
    }
}
