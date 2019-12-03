import { messageType, write } from "@nativescript/core/trace";

const collectionViewTraceCategory = "ns-collectionview";

export function collectionViewLog(message: string): void {
    write(message, collectionViewTraceCategory);
}

export function collectionViewError(message: string): void {
    write(message, collectionViewTraceCategory, messageType.error);
}