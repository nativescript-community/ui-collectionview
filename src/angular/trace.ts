import { Trace } from '@nativescript/core';

const collectionViewTraceCategory = 'ui-collectionview';

export function collectionViewLog(message: string): void {
    Trace.write(message, collectionViewTraceCategory);
}

export function collectionViewError(message: string): void {
    Trace.write(message, collectionViewTraceCategory, Trace.messageType.error);
}
