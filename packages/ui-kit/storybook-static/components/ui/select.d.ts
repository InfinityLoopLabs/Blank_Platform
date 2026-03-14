import * as React from '../../../../../node_modules/react';
import * as SelectPrimitive from "@radix-ui/react-select";
declare function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectTrigger({ className, size, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default";
}): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectContent({ className, children, position, align, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
declare function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>): import('../../../../../node_modules/react/jsx-runtime').JSX.Element;
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue, };
