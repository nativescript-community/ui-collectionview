package com.nativescript.collectionview;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import android.view.View;
import android.view.ViewGroup;

public class Adapter extends RecyclerView.Adapter<CollectionViewCellHolder> {
    public AdapterInterface adapterInterface;

    public Adapter() {
        super();
    }

    @NonNull
    @Override
    public CollectionViewCellHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        if (this.adapterInterface != null) {
            return this.adapterInterface.onCreateViewHolder(parent, viewType);
        }
        return null;
    }

    @NonNull
    @Override
    public void onViewRecycled(@NonNull CollectionViewCellHolder holder) {
        if (this.adapterInterface != null) {
            this.adapterInterface.onViewRecycled(holder);
        }
    }

    @Override
    public void onBindViewHolder(@NonNull CollectionViewCellHolder holder, int position) {
        if (this.adapterInterface != null) {
            this.adapterInterface.onBindViewHolder(holder, position);
        }
    }

    @Override
    public int getItemCount() {
        if (this.adapterInterface != null) {
            return this.adapterInterface.getItemCount();
        }
        return 0;
    }

    @Override
    public int getItemViewType(int position) {
        if (this.adapterInterface != null) {
            return this.adapterInterface.getItemViewType(position);
        }
        return 0;
    }

    @Override
    public long getItemId(int position) {
        if (this.adapterInterface != null) {
            return this.adapterInterface.getItemId(position);
        }
        return RecyclerView.NO_ID;
    }

}