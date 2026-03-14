import Color from 'color';
import { Slider } from 'radix-ui';
import { type ComponentProps, type HTMLAttributes } from '../../../../../../../node_modules/react';
import { Button } from '../../../../components/ui/button';
import { SelectTrigger } from '../../../../components/ui/select';
interface ColorPickerContextValue {
    hue: number;
    saturation: number;
    lightness: number;
    alpha: number;
    mode: string;
    setHue: (hue: number) => void;
    setSaturation: (saturation: number) => void;
    setLightness: (lightness: number) => void;
    setAlpha: (alpha: number) => void;
    setMode: (mode: string) => void;
}
export declare const useColorPicker: () => ColorPickerContextValue;
export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
    value?: Parameters<typeof Color>[0];
    defaultValue?: Parameters<typeof Color>[0];
    onChange?: (value: Parameters<typeof Color.rgb>[0]) => void;
};
export declare const ColorPicker: ({ value, defaultValue, onChange, className, ...props }: ColorPickerProps) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;
export declare const ColorPickerSelection: import('../../../../../../../node_modules/react').MemoExoticComponent<({ className, ...props }: ColorPickerSelectionProps) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element>;
export type ColorPickerHueProps = ComponentProps<typeof Slider.Root>;
export declare const ColorPickerHue: ({ className, ...props }: ColorPickerHueProps) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export type ColorPickerAlphaProps = ComponentProps<typeof Slider.Root>;
export declare const ColorPickerAlpha: ({ className, ...props }: ColorPickerAlphaProps) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>;
export declare const ColorPickerEyeDropper: ({ className, ...props }: ColorPickerEyeDropperProps) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>;
export declare const ColorPickerOutput: ({ className, ...props }: ColorPickerOutputProps) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element;
export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;
export declare const ColorPickerFormat: ({ className, ...props }: ColorPickerFormatProps) => import('../../../../../../../node_modules/react/jsx-runtime').JSX.Element | null;
export {};
