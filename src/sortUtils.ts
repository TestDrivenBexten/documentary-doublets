// Utility sort functions for the app
import { SourceName } from './types/SourceTypes';

export function sortSourceNames(names: SourceName[]): SourceName[] {
    const order: SourceName[] = ['J', 'E', 'P', 'D'];
    return [...names].sort((a, b) => {
        const idxA = order.indexOf(a);
        const idxB = order.indexOf(b);
        if (idxA === -1 && idxB === -1) return a.localeCompare(b);
        if (idxA === -1) return 1;
        if (idxB === -1) return -1;
        return idxA - idxB;
    });
}
