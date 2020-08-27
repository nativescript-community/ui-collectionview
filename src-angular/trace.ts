import { Trace } from "@nativescript/core";

const collectionViewTraceCategory = "ns-collectionview";

export function collectionViewLog(message: string): void {
  Trace.write(message, collectionViewTraceCategory);
}

export function collectionViewError(message: string): void {
  Trace.write(message, collectionViewTraceCategory, Trace.messageType.error);
}