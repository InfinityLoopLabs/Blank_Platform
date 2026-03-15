import type { HTMLAttributes } from '../../../../../../node_modules/react';
type FirstDecisionPropertyType = HTMLAttributes<HTMLDivElement> & {
    cancelText?: string;
    acceptText?: string;
};
export declare const FirstDecision: ({ className, cancelText, acceptText, ...property }: FirstDecisionPropertyType) => import('../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export {};
