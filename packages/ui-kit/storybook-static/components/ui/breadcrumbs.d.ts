import * as React from '../../../../../node_modules/react';
export type BreadcrumbsItemObjectType = {
    key?: React.Key;
    label?: React.ReactNode;
    href?: string;
    onClick?: React.ComponentProps<'a'>['onClick'];
    isCurrent?: boolean;
    component?: React.ReactElement;
};
export type BreadcrumbsItemType = BreadcrumbsItemObjectType | React.ReactElement;
type BreadcrumbsPropertyType = React.ComponentProps<'nav'> & {
    items: BreadcrumbsItemType[];
    maxItems?: number;
    separator?: React.ReactNode;
    listClassName?: string;
};
export declare const Breadcrumbs: ({ items, maxItems, separator, listClassName, ...props }: BreadcrumbsPropertyType) => import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
