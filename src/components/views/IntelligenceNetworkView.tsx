/**
 * KAIROS// Living Intelligence Network
 * Interactive force-directed knowledge graph with 14 entity types & 10 relationship types
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Search,
  Share2,
  Layers,
  ShieldAlert,
  Info,
  X,
  ArrowRight,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { EntityType, GraphEntity, GraphRelationship, RelationshipType } from '../../types/kairos';

interface IntelligenceNetworkViewProps {
  entities: GraphEntity[];
  relationships: GraphRelationship[];
  onSelectEntity?: (entity: GraphEntity) => void;
  onNavigateToDecision?: (decisionId: string) => void;
}

export const IntelligenceNetworkView: React.FC<IntelligenceNetworkViewProps> = ({
  entities: initialEntities,
  relationships: initialRelationships,
  onNavigateToDecision,
}) => {
  const [entities, setEntities] = useState<GraphEntity[]>(initialEntities);
  const [relationships] = useState<GraphRelationship[]>(initialRelationships);
  const [selectedEntity, setSelectedEntity] = useState<GraphEntity | null>(entities[0] || null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync if props change
  useEffect(() => {
    setEntities(initialEntities);
    if (!selectedEntity && initialEntities.length > 0) {
      setSelectedEntity(initialEntities[0]);
    }
  }, [initialEntities]);

  // Handle Dragging
  const handleMouseDownNode = (e: React.MouseEvent, node: GraphEntity) => {
    e.stopPropagation();
    setDraggedNodeId(node.id);
    setSelectedEntity(node);
  };

  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;

      setEntities((prev) =>
        prev.map((n) => (n.id === draggedNodeId ? { ...n, x: mouseX, y: mouseY } : n))
      );
    } else if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.4, Math.min(2.5, prev + delta)));
  };

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Filtered entities
  const filteredEntities = entities.filter((e) => {
    const matchesFilter = filterType === 'all' || e.type === filterType;
    const matchesSearch =
      searchQuery === '' ||
      e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.cluster.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredNodeIds = new Set(filteredEntities.map((e) => e.id));

  // Entity visual styles
  const getNodeColor = (type: EntityType) => {
    switch (type) {
      case 'decision':
        return '#C0A477'; // Champagne Gold
      case 'financial_variable':
        return '#667F72'; // Sage Green
      case 'risk':
        return '#C85A5A'; // Crimson
      case 'assumption':
        return '#D6BE99'; // Warm Amber
      case 'hypothesis':
        return '#8F7954'; // Steel Brown
      case 'recommendation':
        return '#E7E2D9'; // Warm Ivory
      case 'company':
      case 'organization':
        return '#777E80'; // Steel Grey
      default:
        return '#C0A477';
    }
  };

  // Connected relationships for selected entity
  const connectedRelationships = selectedEntity
    ? relationships.filter(
        (r) => r.source === selectedEntity.id || r.target === selectedEntity.id
      )
    : [];

  const connectedNodes = selectedEntity
    ? entities.filter((n) =>
        connectedRelationships.some((r) => r.source === n.id || r.target === n.id)
      )
    : [];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#111315] select-none overflow-hidden relative">
      {/* Top Controls Toolbar */}
      <div className="h-14 px-6 border-b border-[#e7e2d9]/10 flex items-center justify-between bg-[#202326] shrink-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-[#c0a477]" />
            <span className="mono text-xs font-bold uppercase tracking-wider text-[#e7e2d9]">
              LIVING INTELLIGENCE NETWORK
            </span>
          </div>

          <span className="text-[#777e80]">|</span>

          {/* Search in Graph */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#777e80]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entities or relationships..."
              className="bg-[#111315] border border-[#e7e2d9]/10 rounded pl-8 pr-3 py-1 text-xs text-[#e7e2d9] w-56 focus:outline-none focus:border-[#c0a477]"
            />
          </div>

          {/* Entity Type Filter Tabs */}
          <div className="hidden md:flex items-center space-x-1 text-xs">
            {['all', 'decision', 'financial_variable', 'risk', 'assumption', 'organization'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded text-[11px] mono uppercase transition-colors ${
                  filterType === t
                    ? 'bg-[#c0a477]/15 text-[#c0a477] border border-[#c0a477]/30'
                    : 'text-[#777e80] hover:text-[#e7e2d9]'
                }`}
              >
                {t === 'all' ? 'All' : t.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center space-x-2">
          <span className="mono text-[10px] text-[#777e80]">
            ZOOM: {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 rounded bg-[#111315] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-[#777e80] hover:text-[#e7e2d9]"
            title="Zoom In"
            aria-label="Zoom in on graph"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 rounded bg-[#111315] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-[#777e80] hover:text-[#e7e2d9]"
            title="Zoom Out"
            aria-label="Zoom out of graph"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded bg-[#111315] hover:bg-[#292d30] border border-[#e7e2d9]/10 text-[#777e80] hover:text-[#e7e2d9]"
            title="Reset View"
            aria-label="Reset graph view"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas & Inspection Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Interactive SVG Surface */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="flex-1 h-full cursor-grab active:cursor-grabbing bg-terminal-grid relative overflow-hidden"
        >
          <svg
            className="w-full h-full"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: '0 0',
              transition: isPanning || draggedNodeId ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <defs>
              <marker
                id="arrowhead-champagne"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#C0A477" />
              </marker>
              <marker
                id="arrowhead-sage"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#667F72" />
              </marker>
              <marker
                id="arrowhead-rust"
                markerWidth="8"
                markerHeight="6"
                refX="18"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#C85A5A" />
              </marker>
            </defs>

            {/* Links / Edges */}
            {relationships.map((rel) => {
              const srcNode = entities.find((n) => n.id === rel.source);
              const tgtNode = entities.find((n) => n.id === rel.target);
              if (!srcNode || !tgtNode) return null;

              const isHighlighted =
                selectedEntity && (selectedEntity.id === srcNode.id || selectedEntity.id === tgtNode.id);

              const strokeColor =
                rel.type === 'threatens' || rel.type === 'contradicts'
                  ? '#C85A5A'
                  : rel.type === 'supports' || rel.type === 'enables'
                  ? '#667F72'
                  : '#C0A477';

              const midX = (srcNode.x! + tgtNode.x!) / 2;
              const midY = (srcNode.y! + tgtNode.y!) / 2;

              return (
                <g key={rel.id} className="transition-opacity">
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={strokeColor}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeOpacity={isHighlighted ? 0.9 : 0.35}
                    strokeDasharray={rel.type === 'contradicts' ? '4 3' : undefined}
                    markerEnd={`url(#arrowhead-${
                      strokeColor === '#C85A5A' ? 'rust' : strokeColor === '#667F72' ? 'sage' : 'champagne'
                    })`}
                  />
                  {rel.label && isHighlighted && (
                    <text
                      x={midX}
                      y={midY - 4}
                      fill="#e7e2d9"
                      fontSize="9"
                      fontFamily="IBM Plex Mono"
                      textAnchor="middle"
                      className="bg-[#111315] px-1"
                    >
                      {rel.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {filteredEntities.map((node) => {
              const isSelected = selectedEntity?.id === node.id;
              const color = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 300}, ${node.y || 200})`}
                  onMouseDown={(e) => handleMouseDownNode(e, node)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Aura for Selected Node */}
                  {isSelected && (
                    <circle r="26" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
                  )}

                  {/* Core Node Circle */}
                  <circle
                    r={node.type === 'decision' ? 20 : 14}
                    fill="#111315"
                    stroke={color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Inner Glyph / Symbol */}
                  <text
                    textAnchor="middle"
                    dy="3"
                    fill={color}
                    fontSize={node.type === 'decision' ? '9' : '8'}
                    fontFamily="IBM Plex Mono"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {node.type === 'decision' ? 'DEC' : node.type.substring(0, 3).toUpperCase()}
                  </text>

                  {/* Label */}
                  <text
                    y={node.type === 'decision' ? 32 : 24}
                    textAnchor="middle"
                    fill="#e7e2d9"
                    fontSize="10"
                    fontFamily="Inter"
                    fontWeight={isSelected ? '600' : '400'}
                    pointerEvents="none"
                    className="drop-shadow-md"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Bottom HUD Overlay */}
          <div className="absolute bottom-4 left-6 flex items-center space-x-3 text-xs mono text-[#777e80] bg-[#111315]/90 border border-[#e7e2d9]/10 px-3 py-1.5 rounded">
            <span>ENTITIES: {filteredEntities.length}</span>
            <span>•</span>
            <span>RELATIONSHIPS: {relationships.length}</span>
            <span>•</span>
            <span>DRAG NODES TO REPOSITION</span>
          </div>
        </div>

        {/* Right Inspection Drawer */}
        {selectedEntity && (
          <div className="w-80 border-l border-[#e7e2d9]/10 bg-[#202326] p-5 flex flex-col justify-between overflow-y-auto shrink-0 z-10 shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#e7e2d9]/10">
                <div className="flex items-center space-x-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getNodeColor(selectedEntity.type) }}
                  />
                  <span className="mono text-xs uppercase font-semibold text-[#e7e2d9]">
                    ENTITY INSPECTOR
                  </span>
                </div>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="text-[#777e80] hover:text-[#e7e2d9]"
                  aria-label="Close entity inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <span className="mono text-[10px] text-[#c0a477] uppercase block mb-0.5">
                  {selectedEntity.type.replace('_', ' ')}
                </span>
                <h4 className="text-sm font-bold text-[#e7e2d9] leading-snug">
                  {selectedEntity.label}
                </h4>
                <div className="text-[11px] text-[#777e80] mt-1">Cluster: {selectedEntity.cluster}</div>
              </div>

              {selectedEntity.value !== undefined && (
                <div className="p-3 rounded bg-[#111315] border border-[#e7e2d9]/10">
                  <div className="text-[10px] mono text-[#777e80] uppercase">Calculated Metric Value</div>
                  <div className="text-xl font-bold mono text-[#c0a477] mt-1">
                    {selectedEntity.value.toLocaleString()} {selectedEntity.unit || ''}
                  </div>
                </div>
              )}

              {/* Connected Relationships */}
              <div className="space-y-2 pt-2 border-t border-[#e7e2d9]/10">
                <span className="text-[10px] mono uppercase text-[#777e80] block">
                  Connected Dependencies ({connectedNodes.length})
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {connectedNodes.map((n) => {
                    const rel = connectedRelationships.find(
                      (r) =>
                        (r.source === selectedEntity.id && r.target === n.id) ||
                        (r.target === selectedEntity.id && r.source === n.id)
                    );
                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedEntity(n)}
                        className="p-2 rounded bg-[#111315] hover:bg-[#292d30] cursor-pointer text-xs flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="font-medium text-[#e7e2d9] truncate max-w-[160px]">{n.label}</div>
                          <div className="text-[10px] mono text-[#c0a477]">
                            {rel ? rel.type.replace('_', ' ') : 'connected'}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#777e80]" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {selectedEntity.type === 'decision' && (
              <div className="pt-4 border-t border-[#e7e2d9]/10">
                <button
                  onClick={() => onNavigateToDecision && onNavigateToDecision('dec-apac-expansion')}
                  className="w-full py-2 px-3 rounded bg-[#c0a477] hover:bg-[#d6be99] text-[#111315] font-semibold text-xs tracking-wider flex items-center justify-center space-x-2"
                >
                  <span>OPEN DECISION LAB</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
