export type ToolType = 'select' | 'rectangle' | 'circle' | 'text' | 'image';

export interface BaseNode {
  id: string;
  x: number;
  y: number;
  rotation?: number;
  isLocked?: boolean;
}

export interface RectNode extends BaseNode {
  type: 'rectangle';
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  cornerRadius?: number;
}

export interface CircleNode extends BaseNode {
  type: 'circle';
  radius: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface TextNode extends BaseNode {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  align?: 'left' | 'center' | 'right';
}

export interface ImageNode extends BaseNode {
  type: 'image';
  width: number;
  height: number;
  src: string;
}

export type CanvasNode = RectNode | CircleNode | TextNode | ImageNode;
