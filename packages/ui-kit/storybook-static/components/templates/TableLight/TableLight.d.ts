import * as React from '../../../../../../node_modules/react';
import { type TypographyColorType, type TypographyType } from '../../../components/atoms/Typography';
export type TableLightRowType = Record<string, string | number | null | undefined>;
export type TableLightColumnType = {
    key: string;
    header: string;
    typography?: TypographyType;
    color?: TypographyColorType;
    width?: number | string;
    isEditable?: boolean;
    placeholder?: string;
    contentClassName?: string;
    className?: string;
};
export type TableLightPropertyType = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    columns: TableLightColumnType[];
    rows: TableLightRowType[];
    isEditModeEnabled?: boolean;
    isEditModeDisabled?: boolean;
    isInlineEditingLocked?: boolean;
    onRowsChange?: (rows: TableLightRowType[]) => void;
};
export declare const TableLight: ({ columns, rows, className, isEditModeEnabled, isEditModeDisabled, isInlineEditingLocked, onRowsChange, ...property }: TableLightPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
