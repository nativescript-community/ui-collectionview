
declare class AlignedCollectionViewFlowLayout extends UICollectionViewFlowLayout {

	static alloc(): AlignedCollectionViewFlowLayout; // inherited from NSObject

	static new(): AlignedCollectionViewFlowLayout; // inherited from NSObject

	horizontalAlignment: HorizontalAlignment;

	verticalAlignment: VerticalAlignment;

	constructor(o: { horizontalAlignment: HorizontalAlignment; verticalAlignment: VerticalAlignment; });

	initWithHorizontalAlignmentVerticalAlignment(horizontalAlignment: HorizontalAlignment, verticalAlignment: VerticalAlignment): this;
}

declare const enum HorizontalAlignment {

	Left = 0,

	Right = 1,

	Leading = 2,

	Trailing = 3,

	Justified = 4
}

declare const enum VerticalAlignment {

	Top = 0,

	Center = 1,

	Bottom = 2
}
