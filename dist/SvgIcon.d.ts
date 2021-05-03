import * as React from 'react';
import { IconProps } from './IconProps';
interface Path {
    d: string;
    transform?: string;
    fill?: string;
    fillRule?: 'nonzero' | 'evenodd' | 'inherit';
}
interface Circle {
    cx: number;
    cy: number;
    r: number;
}
export interface SvgIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
    id: string;
    testId?: string;
    title?: string;
    viewBox: string;
    paths?: Path[];
    circles?: Circle[];
    style?: React.CSSProperties;
    color?: string;
    size?: number;
}
export declare const SvgIcon: ({ color, size, id: defaultId, title, testId, paths, circles, ...other }: SvgIconProps) => JSX.Element;
export declare function renderIcon(props: IconProps, iconType: any): JSX.Element | null;
export {};
