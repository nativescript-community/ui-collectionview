package com.nativescript.collectionview;

import android.util.SparseArray;

import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class RecycledViewPool extends RecyclerView.RecycledViewPool {

  public RecycledViewPool() {
      super();
  }

  private static final int DEFAULT_MAX_SCRAP = 5;
  public interface ViewPoolListener {
    void onViewHolderDisposed(RecyclerView.ViewHolder holder);
  }
  public ViewPoolListener mListener;

  static class ScrapData {
    final ArrayList<RecyclerView.ViewHolder> mScrapHeap = new ArrayList<>();
    int mMaxScrap = DEFAULT_MAX_SCRAP;
  }

  SparseArray<ScrapData> mScrap = new SparseArray<>();

  @Override
  public void setMaxRecycledViews(int viewType, int max) {
    ScrapData scrapData = getScrapDataForType(viewType);
    scrapData.mMaxScrap = max;
    final ArrayList<RecyclerView.ViewHolder> scrapHeap = scrapData.mScrapHeap;
    while (scrapHeap.size() > max) {
      scrapHeap.remove(scrapHeap.size() - 1);
    }
    super.setMaxRecycledViews(viewType, max);
  }

  @Override
  public void putRecycledView(RecyclerView.ViewHolder scrap) {
    final int viewType = scrap.getItemViewType();
    super.putRecycledView(scrap);
    final ArrayList<RecyclerView.ViewHolder> scrapHeap = getScrapDataForType(viewType).mScrapHeap;
    if (mScrap.get(viewType).mMaxScrap <= scrapHeap.size()) {
      if(mListener != null) {
        mListener.onViewHolderDisposed(scrap);
      }
      return;
    }
    scrapHeap.add(scrap);
  }

  @Override
  public void clear() {
    for (int i = 0; i < mScrap.size(); i++) {
      ScrapData data = mScrap.valueAt(i);
      for (RecyclerView.ViewHolder scrap: data.mScrapHeap) {
        if(mListener != null) {
          mListener.onViewHolderDisposed(scrap);
        }
      }
      data.mScrapHeap.clear();
    }
    super.clear();
  }

  @Override
  public RecyclerView.ViewHolder getRecycledView(int viewType) {
    RecyclerView.ViewHolder result = super.getRecycledView(viewType);
    if(result != null) {
      ScrapData data = getScrapDataForType(viewType);
      data.mScrapHeap.remove(result);
    }
    return result;
  }

  private ScrapData getScrapDataForType(int viewType) {
    ScrapData scrapData = mScrap.get(viewType);
    if (scrapData == null) {
      scrapData = new ScrapData();
      mScrap.put(viewType, scrapData);
    }
    return scrapData;
  }
}