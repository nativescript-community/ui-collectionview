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

export namespace knownTemplates {
  export const itemTemplate = "itemTemplate";
}

export namespace knownMultiTemplates {
  export const itemTemplates = "itemTemplates";
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

  constructor() {
    super();
    this._defaultTemplate = {
      key: "default",
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

  public setMeasuredDimension(measuredWidth: number, measuredHeight: number) {
    super.setMeasuredDimension(measuredWidth, measuredHeight);
    let changed = false;
    this._innerWidth =
      measuredWidth - this.effectivePaddingLeft - this.effectivePaddingRight;
    if (this.colWidth) {
      const newValue = PercentLength.toDevicePixels(
        this.colWidth,
        autoEffectiveColWidth,
        this._innerWidth
      ); // We cannot use 0 for auto as it throws for android.
      if (newValue !== this._effectiveColWidth) {
        this._effectiveColWidth = newValue;
        changed = true;
      }
    }

    this._innerHeight =
      measuredHeight - this.effectivePaddingTop - this.effectivePaddingBottom;
    if (this.rowHeight) {
      const newValue = PercentLength.toDevicePixels(
        this.rowHeight,
        autoEffectiveRowHeight,
        this._innerHeight
      );
      if (newValue !== this._effectiveRowHeight) {
        this._effectiveRowHeight = newValue;
        changed = true;
      }
    }
    if (changed) {
      this.refresh();
    }
  }
  // public onLayout(left: number, top: number, right: number, bottom: number) {
  //   super.onLayout(left, top, right, bottom);
  // }
  items: any[] | ItemsSource;

  public _prepareItem(item: View, index: number) {
    if (item) {
      item.bindingContext = this.getItemAtIndex(index);
    }
  }

  public getItemAtIndex(index: number): any {
    const thisItems = this.items as ItemsSource;
    return thisItems.getItem ? thisItems.getItem(index) : thisItems[index];
  }

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
  // _getDefaultItemContent() {
  //   var lbl = new Label();
  //   lbl["defaultItemView"] = true;
  //   lbl.bind({
  //     targetProperty: "text",
  //     sourceProperty: "$value"
  //   });
  //   return lbl;
  // }
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
          return undefined;
          // return this._getDefaultItemContent();
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
  onItemTemplateChanged(oldValue, newValue) {
  }
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
  onLoaded() {
    super.onLoaded();
    this.refresh();
  }
  onSourceCollectionChanged(event: ChangedData<any>) {
    this.refresh();
  }
  onSourceCollectionChangedInternal(event: ChangedData<any>) {
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
  }
});
rowHeightProperty.register(CollectionViewBase);

const defaultColWidth: PercentLength = { unit: "%", value: 1 };
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
