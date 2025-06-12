import { NavSidebarParentRowItem, NavSidebarRowItem } from '@mt-ng2/nav-module';

export function removeNullNavItems<T extends NavSidebarRowItem | NavSidebarParentRowItem>(navItems: (T | null | undefined)[]): T[] {
    const result = navItems.filter((item) => item !== null && item !== undefined);
    for (const row of result) {
        if (row instanceof NavSidebarParentRowItem) {
            row.children = removeNullNavItems(row.children);
        }
    }
    return result;
}
