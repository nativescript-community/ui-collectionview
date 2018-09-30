/*! *****************************************************************************
Copyright (c) 2017 Tangra Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
***************************************************************************** */

// import { ObservableArray } from 'data/observable-array';
import * as observable from "data/observable";
import { parseMultipleTemplates } from "ui/builder";
import {
  makeParser,
  makeValidator,
  widthProperty,
  heightProperty
} from "ui/content-view";
import {
  CoercibleProperty,
  KeyedTemplate,
  Length,
  PercentLength,
  Property,
  Template,
  View
} from "ui/core/view";
import {
  addWeakEventListener,
  removeWeakEventListener
} from "ui/core/weak-event-listener";
import { Label } from "ui/label";
import { ItemsSource } from "ui/list-view";
import {
  CollectionView as CollectionViewDefinition,
  Orientation
} from "./collectionview";
import { ObservableArray, ChangedData } from "data/observable-array";
import * as builder from "tns-core-modules/ui/builder";

const autoEffectiveRowHeight = 0;
const autoEffectiveColWidth = 0;

export * from "ui/core/view";

export enum ListViewViewTypes {
  ItemView
}
export abstract class CollectionViewBase extends View
  implements CollectionViewDefinition {
  public static itemLoadingEvent = "itemLoading";
  public static cellCreateEvent = "cellCreate";
  public static scrollEvent = "scroll";
  public static itemTapEvent = "itemTap";
  public static loadMoreItemsEvent = "loadMoreItems";
  public static dataPopulatedEvent = "dataPopulated";
  public static knownFunctions = ["itemTemplateSelector", "itemIdGenerator"]; // See component-builder.ts isKnownFunction

  public orientation: Orientation;
  public itemTemplate: string | Template;
  public itemTemplates: string | KeyedTemplate[];
  // public items: any[] | ItemsSource;
  public isItemsSourceIn: boolean;
  public rowHeight: PercentLength;
  public colWidth: PercentLength;
  public verticalSpacing: Length;
  public horizontalSpacing: Length;
  public _innerWidth: number = 0;
  public _innerHeight: number = 0;
  public _effectiveRowHeight: number;
  public _effectiveColWidth: number;

  protected _itemTemplatesInternal: KeyedTemplate[];
  protected _defaultTemplate: KeyedTemplate;
  private _itemTemplateSelectorBindable = new Label();
  private _itemTemplateSelector: (
    item: any,
    index: number,
    items: any
  ) => string;

  constructor() {
    super();
    this._defaultTemplate = {
      key: "__default",
      createView: () => {
        if (this.itemTemplate) {
          return builder.parse(this.itemTemplate, this);
        }
        return undefined;
      }
    };
    this._itemTemplatesInternal = new Array(this._defaultTemplate);
  }

  public itemIdGenerator: (item: any, index: number, items: any) => number = (
    _item: any,
    index: number
  ) => index;

  public abstract refresh();
  public abstract scrollToIndex(index: number, animated: boolean);

  public onLayout(left: number, top: number, right: number, bottom: number) {
    super.onLayout(left, top, right, bottom);
    this._innerWidth =
      right - left - this.effectivePaddingLeft - this.effectivePaddingRight;
    // console.log('onLayout', this.colWidth, this.rowHeight);
    if (this.colWidth) {
      this._effectiveColWidth = PercentLength.toDevicePixels(
        this.colWidth,
        autoEffectiveColWidth,
        this._innerWidth
      ); // We cannot use 0 for auto as it throws for android.
    }

    this._innerHeight =
      bottom - top - this.effectivePaddingTop - this.effectivePaddingBottom;
    if (this.rowHeight) {
      this._effectiveRowHeight = PercentLength.toDevicePixels(
        this.rowHeight,
        autoEffectiveRowHeight,
        this._innerHeight
      );
    }
  }
  items: any[] | ItemsSource;
  // get items(): any[] | ItemsSource {
  //   return this._getValue(itemsProperty);
  // }
  // set items(value: any[] | ItemsSource) {
  //   this._setValue(itemsProperty, value);
  // }

  public _prepareItem(item: View, index: number) {
    if (item) {
      // const dataItem = this._getDataItem(row);
      // console.log('_prepareItem', item, row, dataItem);
      // if (!(dataItem instanceof observable.Observable)) {
      //     item.bindingContext = null;
      // }
      item.bindingContext = this.getItemAtIndex(index);
    }
  }

  public getItemAtIndex(index: number): any {
    // console.log('_getDataItem', index, this.items);
    // if(this.sections.getItem()) {
    // return this.items.getItem(row);
    // }
    const thisItems = this.items as ItemsSource;
    return thisItems.getItem ? thisItems.getItem(index) : thisItems[index];
    // return this.isItemsSourceIn ? (this.items as ItemsSource).getItem(index) : this.items[index];
  }

  // public _getDefaultHeaderContent(row: number, section:number = 0): View {
  //     var label: typeof labelModule = require("ui/label");

  //     var lbl = new label.Label();
  //     lbl.bind({
  //         targetProperty: "text",
  //         sourceProperty: "$value"
  //     });
  //     return lbl;
  // }

  public _onRowHeightPropertyChanged(
    oldValue: PercentLength,
    newValue: PercentLength
  ) {
    this.refresh();
  }
  public _onColWidthPropertyChanged(
    oldValue: PercentLength,
    newValue: PercentLength
  ) {
    this.refresh();
  }
  onItemViewLoaderChanged() {}
  _itemViewLoader;
  get itemViewLoader() {
    return this._itemViewLoader;
  }
  set itemViewLoader(value) {
    if (this._itemViewLoader !== value) {
      this._itemViewLoader = value;
      this.onItemViewLoaderChanged();
    }
  }
  resolveTemplateView(template) {
    return builder.parse(template, this);
  }
  _getDefaultItemContent() {
    var lbl = new Label();
    lbl['defaultItemView'] = true;
    lbl.bind({
      targetProperty: "text",
      sourceProperty: "$value"
    });
    return lbl;
  }
  getTemplateFromSelector(templateKey) {
    for (
      var i = 0, length_1 = this._itemTemplatesInternal.length;
      i < length_1;
      i++
    ) {
      if (
        this._itemTemplatesInternal[i].key.toLowerCase() ===
        templateKey.toLowerCase()
      ) {
        return this._itemTemplatesInternal[i];
      }
    }
    // This is the default template
    return this._itemTemplatesInternal[0];
  }
  getViewForViewType(viewType, templateKey) {
    var newView = undefined;
    if (templateKey) {
      var template = this.getTemplateFromSelector(templateKey);
      newView = template.createView();
      // console.log('getViewForViewType', templateKey, newView);
    }
    if (!newView && this._itemViewLoader !== undefined) {
      newView = this._itemViewLoader(viewType);
    }
    if (newView) {
      return newView;
    }
    var templateString = undefined;
    switch (viewType) {
      case ListViewViewTypes.ItemView:
        templateString = this.itemTemplate;
        if (templateString === undefined) {
          return this._getDefaultItemContent();
        }
        break;
    }
    return templateString === undefined
      ? undefined
      : this.resolveTemplateView(templateString);
  }
  itemTemplateSelector: Function;
  onItemTemplateSelectorChanged(oldValue, newValue) {
    if (typeof newValue === "string") {
      this._itemTemplateSelectorBindable.bind({
        sourceProperty: null,
        targetProperty: "templateKey",
        expression: newValue
      });
      this.itemTemplateSelector = function(item, index, items) {
        item["$index"] = index;
        this._itemTemplateSelectorBindable.bindingContext = item;
        return this._itemTemplateSelectorBindable.get("templateKey");
      };
    } else if (typeof newValue === "function") {
      this.itemTemplateSelector = newValue;
    }
  }
  onItemTemplatesChanged(oldValue, newValue) {
    this._itemTemplatesInternal = new Array(this._defaultTemplate);
    if (newValue) {
      this._itemTemplatesInternal = this._itemTemplatesInternal.concat(
        newValue
      );
    }
  }
  onItemTemplateChanged(oldValue, newValue) {}
  onItemTemplateSelectorPropertyChanged(oldValue, newValue) {
    this.onItemTemplateSelectorChanged(oldValue, newValue);
  }
  onItemTemplatesPropertyChanged(oldValue, newValue) {
    this.onItemTemplatesChanged(oldValue, newValue);
  }
  onItemTemplatePropertyChanged(oldValue, newValue) {
    this.onItemTemplateChanged(oldValue, newValue);
  }

  onItemsChangedInternal = (oldValue, newValue) => {
    // console.log("onItemsChangedInternal", newValue instanceof observable.Observable);

    const getItem = newValue && (newValue as ItemsSource).getItem;

    this.isItemsSourceIn = typeof getItem === "function";

    if (oldValue instanceof observable.Observable) {
      removeWeakEventListener(
        oldValue,
        ObservableArray.changeEvent,
        this.onSourceCollectionChangedInternal,
        this
      );
    }

    if (newValue instanceof observable.Observable) {
      addWeakEventListener(
        newValue,
        ObservableArray.changeEvent,
        this.onSourceCollectionChangedInternal,
        this
      );
    }
    if (!this.isLoaded) {
      return;
    }
    this.refresh();
  };
  onSourceCollectionChanged(event: ChangedData<any>) {
    this.refresh();
  }
  onSourceCollectionChangedInternal(event: ChangedData<any>) {
    // console.log("onSourceCollectionChangedInternal");
    this.onSourceCollectionChanged(event);
  }
  onItemsChanged(oldValue, newValue) {
    this.onItemsChangedInternal(oldValue, newValue);
  }

  [widthProperty.getDefault]() {
    return "100%";
  }
  [heightProperty.getDefault]() {
    return "100%";
  }
}

const defaultRowHeight: Length = "auto";
export const rowHeightProperty = new CoercibleProperty<
  CollectionViewBase,
  PercentLength
>({
  name: "rowHeight",
  defaultValue: defaultRowHeight,
  equalityComparer: PercentLength.equals,
  valueConverter: PercentLength.parse,
  coerceValue: (target, value) => {
    // We coerce to default value if we don't have display density.
    return target.nativeView ? value : defaultRowHeight;
  },
  valueChanged: (target, oldValue, newValue) => {
    target._effectiveRowHeight = PercentLength.toDevicePixels(
      newValue,
      autoEffectiveRowHeight,
      target._innerHeight
    );
    target._onRowHeightPropertyChanged(oldValue, newValue);
    // target.refresh();
  }
});
rowHeightProperty.register(CollectionViewBase);

const defaultColWidth: PercentLength = "auto";
export const colWidthProperty = new CoercibleProperty<
  CollectionViewBase,
  PercentLength
>({
  name: "colWidth",
  defaultValue: defaultColWidth,
  equalityComparer: PercentLength.equals,
  valueConverter: PercentLength.parse,
  coerceValue: (target, value) => {
    // We coerce to default value if we don't have display density.
    return target.nativeView ? value : defaultColWidth;
  },
  valueChanged: (target, oldValue, newValue) => {
    target._effectiveColWidth = PercentLength.toDevicePixels(
      newValue,
      autoEffectiveColWidth,
      target._innerWidth
    );
    target._onColWidthPropertyChanged(oldValue, newValue);
    // target.refresh();
  }
});
colWidthProperty.register(CollectionViewBase);

const converter = makeParser<Orientation>(
  makeValidator("horizontal", "vertical")
);
export const orientationProperty = new Property<
  CollectionViewBase,
  Orientation
>({
  name: "orientation",
  defaultValue: "vertical",
  affectsLayout: true,
  valueChanged: (
    target: CollectionViewBase,
    oldValue: Orientation,
    newValue: Orientation
  ) => {
    target.refresh();
  },
  valueConverter: converter
});
orientationProperty.register(CollectionViewBase);

export const itemTemplateProperty = new Property<
  CollectionViewBase,
  string | Template
>({
  name: "itemTemplate",
  valueChanged: function(target, oldValue, newValue) {
    target.onItemTemplatePropertyChanged(oldValue, newValue);
  }
});
itemTemplateProperty.register(CollectionViewBase);

export const itemTemplatesProperty = new Property<
  CollectionViewBase,
  KeyedTemplate[]
>({
  name: "itemTemplates",
  valueConverter: value => {
    if (typeof value === "string") {
      return parseMultipleTemplates(value);
    }

    return value;
  },
  valueChanged: function(target, oldValue, newValue) {
    target.onItemTemplatesPropertyChanged(oldValue, newValue);
  }
});
itemTemplatesProperty.register(CollectionViewBase);

export const itemTemplateSelectorProperty = new Property<
  CollectionViewBase,
  Function
>({
  name: "itemTemplateSelector",
  defaultValue: undefined,
  valueChanged: function(target, oldValue, newValue) {
    target.onItemTemplateSelectorPropertyChanged(oldValue, newValue);
  }
});
itemTemplateSelectorProperty.register(CollectionViewBase);

export const itemsProperty = new Property<CollectionViewBase, Function>({
  name: "items",
  defaultValue: undefined,
  valueChanged: function(target, oldValue, newValue) {
    target.onItemsChanged(oldValue, newValue);
  }
});
itemsProperty.register(CollectionViewBase);
