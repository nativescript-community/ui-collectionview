import { messageType, write } from "tns-core-modules/trace";

const gridViewTraceCategory = "ns-grid-view";

export function gridViewLog(message: string): void {
    write(message, gridViewTraceCategory);
}

export function gridViewError(message: string): void {
    write(message, gridViewTraceCategory, messageType.error);
}