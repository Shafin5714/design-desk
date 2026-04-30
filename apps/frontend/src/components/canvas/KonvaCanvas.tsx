"use client";

import { Stage, Layer, Rect, Circle, Text } from 'react-konva';
import { useEditorStore } from '@/store/useEditorStore';
import { CanvasNode } from '@/types/canvas';

export default function KonvaCanvas() {
  const nodes = useEditorStore((state) => state.nodes);
  const zoom = useEditorStore((state) => state.zoom);

  // In a real app, you'd calculate this based on container size or project settings.
  const stageWidth = 800;
  const stageHeight = 600;

  const renderNode = (node: CanvasNode) => {
    switch (node.type) {
      case 'rectangle':
        return (
          <Rect
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            fill={node.fill}
            rotation={node.rotation || 0}
            stroke={node.stroke}
            strokeWidth={node.strokeWidth}
            cornerRadius={node.cornerRadius}
            draggable={!node.isLocked}
          />
        );
      case 'circle':
        return (
          <Circle
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            radius={node.radius}
            fill={node.fill}
            rotation={node.rotation || 0}
            stroke={node.stroke}
            strokeWidth={node.strokeWidth}
            draggable={!node.isLocked}
          />
        );
      case 'text':
        return (
          <Text
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            text={node.text}
            fontSize={node.fontSize}
            fontFamily={node.fontFamily}
            fill={node.fill}
            rotation={node.rotation || 0}
            align={node.align}
            draggable={!node.isLocked}
          />
        );
      // Image node requires a special hook (useImage) which we will implement later in Step 5.
      default:
        return null;
    }
  };

  return (
    <Stage 
      width={stageWidth} 
      height={stageHeight}
      scaleX={zoom / 100}
      scaleY={zoom / 100}
      className="bg-white shadow-2xl rounded-sm ring-1 ring-black/5"
    >
      <Layer>
        {nodes.map(renderNode)}
      </Layer>
    </Stage>
  );
}
