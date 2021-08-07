declare const _default: {
    props: {
        items: {
            validator: (val: any) => boolean;
            required: boolean;
        };
        '+alias': {
            type: StringConstructor;
            default: string;
        };
        '+index': {
            type: StringConstructor;
        };
        itemTemplateSelector: {
            type: FunctionConstructor;
            default: any;
        };
    };
    template: string;
    watch: {
        items: {
            handler(newVal: any, oldVal: any): void;
            deep: boolean;
        };
    };
    created(): void;
    mounted(): void;
    methods: {
        getItem(index: any): any;
        onItemTap(args: any): void;
        updateViewTemplate(args: any): void;
        onItemLoadingInternal(args: any): void;
        refresh(): void;
        scrollToIndex(index: any, animate?: boolean): void;
    };
};
export default _default;
