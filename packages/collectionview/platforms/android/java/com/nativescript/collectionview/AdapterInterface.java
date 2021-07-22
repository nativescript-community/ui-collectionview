package com.nativescript.collectionview;

import android.view.ViewGroup;

import androidx.annotation.NonNull;

public interface AdapterInterface {
    CollectionViewCellHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType);

    void onBindViewHolder(@NonNull CollectionViewCellHolder holder, int position);

    void onViewRecycled(@NonNull CollectionViewCellHolder holder);

    int getItemViewType(int position);

    long getItemId(int position);

    int getItemCount();
}