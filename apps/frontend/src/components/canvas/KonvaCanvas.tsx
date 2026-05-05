"use client";

import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Transformer, Image as KonvaImage } from 'react-konva';
import { useEditorStore } from '@/store/useEditorStore';
import { CanvasNode, ImageNode } from '@/types/canvas';

const URLImage = ({ src, ...props }: any) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  return <KonvaImage image={image || undefined} {...props} />;
};

export default function KonvaCanvas() {
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const nodes = useEditorStore((state) => state.nodes);
  const zoom = useEditorStore((state) => state.zoom);
  const selectedNodeId = useEditorStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useEditorStore((state) => state.setSelectedNodeId);
  const updateNode = useEditorStore((state) => state.updateNode);
  const activeTool = useEditorStore((state) => state.activeTool);
  const setStageRef = useEditorStore((state) => state.setStageRef);

  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  // Store the stageRef globally so Header can export it
  useEffect(() => {
    setStageRef(stageRef);
  }, [setStageRef]);

  // In a real app, you'd calculate this based on container size or project settings.
  const stageWidth = 800;
  const stageHeight = 600;

  // Attach transformer to selected node
  useEffect(() => {
    if (selectedNodeId && trRef.current && stageRef.current) {
      // Find the node by id
      const selectedNode = stageRef.current.findOne(`#${selectedNodeId}`);
      if (selectedNode) {
        trRef.current.nodes([selectedNode]);
        trRef.current.getLayer().batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
    }
  }, [selectedNodeId, nodes.length]); // re-run if selection changes or a new node is added

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedNodeId(null);
    }
  };

  const handleSelect = (id: string) => {
    if (activeTool === 'select') {
      setSelectedNodeId(id);
    }
  };

  const handleDragEnd = (e: any, id: string) => {
    updateNode(id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = (e: any, node: CanvasNode) => {
    const konvaNode = e.target;
    
    // We apply scale to width/height (or radius) to avoid CSS scaling issues
    const scaleX = konvaNode.scaleX();
    const scaleY = konvaNode.scaleY();
    
    // Reset scale to 1 back on the Konva node instance
    konvaNode.scaleX(1);
    konvaNode.scaleY(1);

    const baseUpdates = {
      x: konvaNode.x(),
      y: konvaNode.y(),
      rotation: konvaNode.rotation(),
    };

    if (node.type === 'rectangle' || node.type === 'image') {
      updateNode(node.id, {
        ...baseUpdates,
        width: Math.max(5, konvaNode.width() * scaleX),
        height: Math.max(5, konvaNode.height() * scaleY),
      });
    } else if (node.type === 'circle') {
      updateNode(node.id, {
        ...baseUpdates,
        radius: Math.max(5, node.radius * scaleX),
      });
    } else if (node.type === 'text') {
      updateNode(node.id, {
        ...baseUpdates,
        width: Math.max(5, konvaNode.width() * scaleX),
        fontSize: Math.max(12, node.fontSize * scaleX),
      });
    }
  };

  const renderNode = (node: CanvasNode) => {
    const isSelected = node.id === selectedNodeId;
    const isDraggable = activeTool === 'select' && !node.isLocked;

    const commonProps = {
      key: node.id,
      id: node.id,
      x: node.x,
      y: node.y,
      rotation: node.rotation || 0,
      draggable: isDraggable,
      onClick: () => handleSelect(node.id),
      onTap: () => handleSelect(node.id),
      onDblClick: () => {
        if (node.type === 'text') {
          setEditingNodeId(node.id);
          setSelectedNodeId(null); // Hide transformer
        }
      },
      onDblTap: () => {
        if (node.type === 'text') {
          setEditingNodeId(node.id);
          setSelectedNodeId(null);
        }
      },
      onDragEnd: (e: any) => handleDragEnd(e, node.id),
      onTransformEnd: (e: any) => handleTransformEnd(e, node),
    };

    switch (node.type) {
      case 'rectangle':
        return (
          <Rect
            {...commonProps}
            width={node.width}
            height={node.height}
            fill={node.fill}
            stroke={node.stroke}
            strokeWidth={node.strokeWidth}
            cornerRadius={node.cornerRadius}
          />
        );
      case 'circle':
        return (
          <Circle
            {...commonProps}
            radius={node.radius}
            fill={node.fill}
            stroke={node.stroke}
            strokeWidth={node.strokeWidth}
          />
        );
      case 'text':
        return (
          <Text
            {...commonProps}
            text={node.text}
            fontSize={node.fontSize}
            fontFamily={node.fontFamily}
            fill={node.fill}
            align={node.align}
            visible={node.id !== editingNodeId}
          />
        );
      case 'image':
        return (
          <URLImage
            {...commonProps}
            src={(node as ImageNode).src}
            width={node.width}
            height={node.height}
          />
        );
      default:
        return null;
    }
  };

  const editingNode = nodes.find(n => n.id === editingNodeId) as any;

  return (
    <div className="relative" style={{ width: stageWidth, height: stageHeight }}>
      <Stage 
        ref={stageRef}
        width={stageWidth} 
        height={stageHeight}
        scaleX={zoom / 100}
        scaleY={zoom / 100}
        className="bg-white shadow-2xl rounded-sm ring-1 ring-black/5 cursor-crosshair"
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        style={{ cursor: activeTool === 'select' ? 'default' : 'crosshair' }}
      >
        <Layer>
          {nodes.map(renderNode)}
          
          <Transformer 
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit minimum size
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
            // Customize transformer styles to look more premium
            anchorSize={8}
            anchorCornerRadius={4}
            anchorStroke="#6366f1"
            anchorFill="#ffffff"
            borderStroke="#6366f1"
            borderDash={[4, 4]}
          />
        </Layer>
      </Stage>

      {/* HTML Textarea Overlay for Inline Editing */}
      {editingNode && editingNode.type === 'text' && (
        <textarea
          value={editingNode.text}
          onChange={(e) => updateNode(editingNode.id, { text: e.target.value })}
          onBlur={() => setEditingNodeId(null)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setEditingNodeId(null);
            // Optional: Shift+Enter for new line, Enter to submit
            // if (e.key === 'Enter' && !e.shiftKey) {
            //   e.preventDefault();
            //   setEditingNodeId(null);
            // }
          }}
          autoFocus
          style={{
            position: 'absolute',
            top: `${editingNode.y * (zoom / 100)}px`,
            left: `${editingNode.x * (zoom / 100)}px`,
            width: `${Math.max(editingNode.width || 200, 50) * (zoom / 100)}px`,
            height: `${editingNode.fontSize * 1.5 * (zoom / 100)}px`,
            fontSize: `${editingNode.fontSize * (zoom / 100)}px`,
            fontFamily: editingNode.fontFamily,
            color: editingNode.fill,
            transform: `rotate(${editingNode.rotation || 0}deg)`,
            transformOrigin: 'top left',
            background: 'transparent',
            border: 'none',
            outline: '2px solid rgba(99, 102, 241, 0.5)', // Subtle indigo outline
            padding: 0,
            margin: 0,
            overflow: 'hidden',
            resize: 'none',
            lineHeight: 1,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
