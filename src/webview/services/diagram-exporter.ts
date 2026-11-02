import type {
  EndpointDecoration,
  UmlDocument,
  UmlEdge,
  UmlNodeLayout,
  UmlRoutingKind
} from '../../shared/documents/types';
import {
  buildShapeSvgPath,
  computeUmlEdgeGeometry,
  getMultiplicityLabelPoint,
  type Point2D
} from '../../shared/geometry';
import {
  extractOperationParameters,
  formatVisibilitySign
} from '../../shared/operations';
import { getEndpointShape, getUmlNodeKind } from '../../shared/registry/uml-registry';

export interface RenderedDiagram {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

export interface DiagramTheme {
  widgetBg: string;
  editorFg: string;
  panelBorder: string;
  descriptionFg: string;
  noteBg: string;
  editorBg: string;
  fontFamily: string;
  monoFamily: string;
  nodeBorder: string;
}

export interface RenderDiagramOptions {
  doc: UmlDocument;
  layouts: Record<string, UmlNodeLayout>;
  parallelOffsets?: Record<string, number>;
  defaultRouting?: UmlRoutingKind;
  theme?: Partial<DiagramTheme>;
  viewportElement?: HTMLElement | null;
  scale?: number;
}

const FALLBACK_THEME: DiagramTheme = {
  widgetBg: '#252526',
  editorFg: '#cccccc',
  panelBorder: 'rgba(128, 128, 128, 0.35)',
  descriptionFg: '#999999',
  noteBg: '#252526',
  editorBg: '#1e1e1e',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  monoFamily: 'Consolas, "Courier New", monospace',
  nodeBorder: 'rgba(128, 128, 128, 0.35)'
};

function readTheme(viewportElement?: HTMLElement | null): DiagramTheme {
  if (typeof window === 'undefined') return FALLBACK_THEME;
  const viewportStyles = viewportElement ? window.getComputedStyle(viewportElement) : null;
  const bodyStyles = window.getComputedStyle(document.body);
  const read = (name: string, fallback: string): string =>
    viewportStyles?.getPropertyValue(name)?.trim() ||
    bodyStyles.getPropertyValue(name)?.trim() ||
    fallback;

  const widgetBg = read('--vscode-editorWidget-background', FALLBACK_THEME.widgetBg);
  const panelBorder = read('--vscode-panel-border', FALLBACK_THEME.panelBorder);
  return {
    widgetBg,
    panelBorder,
    editorFg: read('--vscode-editor-foreground', FALLBACK_THEME.editorFg),
    descriptionFg: read('--vscode-descriptionForeground', FALLBACK_THEME.descriptionFg),
    noteBg: read('--vscode-textBlockQuote-background', widgetBg),
    editorBg: read('--vscode-editor-background', FALLBACK_THEME.editorBg),
    fontFamily: read('--vscode-font-family', FALLBACK_THEME.fontFamily),
    monoFamily: read('--vscode-editor-font-family', FALLBACK_THEME.monoFamily),
    nodeBorder: panelBorder
  };
}

function resolveRouting(edge: UmlEdge, defaultRouting: UmlRoutingKind | undefined): UmlRoutingKind {
  const routing = edge.visual?.routing;
  if (!routing || routing === 'default') return defaultRouting ?? 'orthogonal';
  return routing;
}

export function renderEndpointPath(decoration: EndpointDecoration | undefined): {
  d: string;
  fill: string;
} {
  const shape = getEndpointShape(decoration?.shape ?? 'none');
  if (!shape || shape.kind === 'none') return { d: '', fill: 'none' };
  const size = decoration?.size ?? shape.defaultSize;
  const d = shape.buildLocalPath(size);
  if (!shape.supportsFill) return { d, fill: 'none' };
  return {
    d,
    fill: (decoration?.fill ?? shape.defaultFill ?? 'hollow') === 'filled' ? 'filled' : 'hollow'
  };
}

/**
 * Rasterizes the current diagram at 2x resolution with a transparent background.
 * This is used only for explicit export actions, never during a gesture.
 */
export function renderDiagramToCanvas(options: RenderDiagramOptions): RenderedDiagram | null {
  const { doc, layouts } = options;
  if (!doc || doc.nodes.length === 0) return null;
  if (typeof document === 'undefined') return null;

  const boxes = Object.values(layouts);
  if (boxes.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const box of boxes) {
    minX = Math.min(minX, box.x);
    minY = Math.min(minY, box.y);
    maxX = Math.max(maxX, box.x + box.width);
    maxY = Math.max(maxY, box.y + box.height);
  }

  const theme: DiagramTheme = { ...readTheme(options.viewportElement), ...options.theme };
  const parallelOffsets = options.parallelOffsets ?? {};

  type EdgeGeometryItem = {
    edge: UmlEdge;
    geometry: ReturnType<typeof computeUmlEdgeGeometry>;
    startDecoration: EndpointDecoration;
    endDecoration: EndpointDecoration;
    isDashed: boolean;
    startMarker: { d: string; fill: string };
    endMarker: { d: string; fill: string };
    startMultiplicityPoint: Point2D;
    endMultiplicityPoint: Point2D;
  };

  const edgeItems: EdgeGeometryItem[] = [];
  for (const edge of doc.edges) {
    const sourceBox = layouts[edge.source.nodeId];
    const targetBox = layouts[edge.target.nodeId];
    if (!sourceBox || !targetBox) continue;

    const sourceNode = doc.nodes.find((node) => node.id === edge.source.nodeId);
    const targetNode = doc.nodes.find((node) => node.id === edge.target.nodeId);
    const touchesNote = sourceNode?.kind === 'note' || targetNode?.kind === 'note';
    const isDashed = (edge.visual?.line ?? (touchesNote ? 'dashed' : 'solid')) === 'dashed';
    const startDecoration = edge.visual?.start ?? { shape: 'none', size: 10 };
    const endDecoration = edge.visual?.end ?? { shape: 'none', size: 10 };
    const geometry = computeUmlEdgeGeometry(
      sourceBox,
      targetBox,
      resolveRouting(edge, options.defaultRouting),
      startDecoration,
      endDecoration,
      parallelOffsets[edge.id] ?? 0,
      undefined,
      undefined,
      sourceNode?.kind === 'shape' ? sourceNode.shape : undefined,
      targetNode?.kind === 'shape' ? targetNode.shape : undefined,
      edge.label
    );
    const startMarker = renderEndpointPath(startDecoration);
    const endMarker = renderEndpointPath(endDecoration);
    const startMultiplicityPoint = getMultiplicityLabelPoint(
      geometry.startTip,
      geometry.startAngleDeg,
      edge.source.multiplicity
    );
    const endMultiplicityPoint = getMultiplicityLabelPoint(
      geometry.endTip,
      geometry.endAngleDeg,
      edge.target.multiplicity
    );

    edgeItems.push({
      edge,
      geometry,
      startDecoration,
      endDecoration,
      isDashed,
      startMarker,
      endMarker,
      startMultiplicityPoint,
      endMultiplicityPoint
    });

    if (edge.label) {
      minX = Math.min(minX, geometry.labelPoint.x - 50);
      minY = Math.min(minY, geometry.labelPoint.y - 20);
      maxX = Math.max(maxX, geometry.labelPoint.x + 50);
      maxY = Math.max(maxY, geometry.labelPoint.y + 20);
    }
    if (edge.source.multiplicity) {
      minX = Math.min(minX, startMultiplicityPoint.x - 30);
      minY = Math.min(minY, startMultiplicityPoint.y - 15);
      maxX = Math.max(maxX, startMultiplicityPoint.x + 30);
      maxY = Math.max(maxY, startMultiplicityPoint.y + 15);
    }
    if (edge.target.multiplicity) {
      minX = Math.min(minX, endMultiplicityPoint.x - 30);
      minY = Math.min(minY, endMultiplicityPoint.y - 15);
      maxX = Math.max(maxX, endMultiplicityPoint.x + 30);
      maxY = Math.max(maxY, endMultiplicityPoint.y + 15);
    }
  }

  const padding = 40;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  const width = Math.max(200, Math.ceil(maxX - minX));
  const height = Math.max(200, Math.ceil(maxY - minY));
  const scale = options.scale ?? 2;

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);
  ctx.translate(-minX, -minY);

  const drawRoundRect = (x: number, y: number, w: number, h: number, radius: number): void => {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, y, w, h, radius);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.arcTo(x + w, y, x + w, y + radius, radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
      ctx.lineTo(x + radius, y + h);
      ctx.arcTo(x, y + h, x, y + h - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
    }
  };

  // Frames
  for (const node of doc.nodes) {
    if (node.kind !== 'frame') continue;
    const box = layouts[node.id];
    if (!box) continue;

    ctx.save();
    ctx.translate(box.x, box.y);
    drawRoundRect(0, 0, box.width, box.height, 6);
    ctx.strokeStyle = theme.nodeBorder;
    ctx.lineWidth = 3;
    ctx.setLineDash(node.line === 'dashed' ? [8, 6] : []);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = `11px ${theme.fontFamily}`;
    const label = node.name || 'Frame';
    const metrics = ctx.measureText(label);
    const badgeWidth = Math.max(label.length * 7.6 + 16, metrics.width + 16);
    drawRoundRect(16, -10, badgeWidth, 20, 4);
    ctx.fillStyle = theme.widgetBg;
    ctx.fill();
    ctx.strokeStyle = theme.panelBorder;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = theme.editorFg;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 16 + badgeWidth / 2, 0);
    ctx.restore();
  }

  // Edges
  for (const item of edgeItems) {
    const { edge, geometry, isDashed, startMarker, endMarker, startDecoration, endDecoration } = item;

    ctx.save();
    ctx.strokeStyle = theme.editorFg;
    ctx.lineWidth = 1.75;
    ctx.setLineDash(isDashed ? [6, 4] : []);
    ctx.stroke(new Path2D(geometry.pathD));
    ctx.restore();

    const drawMarker = (marker: { d: string; fill: string }, tip: Point2D, angle: number, decoration: EndpointDecoration): void => {
      if (!marker.d) return;
      ctx.save();
      ctx.translate(tip.x, tip.y);
      ctx.rotate((angle * Math.PI) / 180);
      const path = new Path2D(marker.d);
      if (marker.fill !== 'none') {
        ctx.fillStyle = decoration.fill === 'filled' ? theme.editorFg : theme.editorBg;
        ctx.fill(path);
      }
      ctx.strokeStyle = theme.editorFg;
      ctx.lineWidth = 1.75;
      ctx.lineJoin = 'round';
      ctx.stroke(path);
      ctx.restore();
    };

    drawMarker(startMarker, geometry.startTip, geometry.startAngleDeg, startDecoration);
    drawMarker(endMarker, geometry.endTip, geometry.endAngleDeg, endDecoration);

    const drawMultiplicity = (point: Point2D, text: string): void => {
      ctx.save();
      ctx.font = `600 10.5px ${theme.monoFamily}`;
      const metrics = ctx.measureText(text);
      const widthBadge = Math.max(text.length * 7.6 + 12, metrics.width + 12);
      const left = point.x - widthBadge / 2;
      const top = point.y - 9;
      drawRoundRect(left, top, widthBadge, 17, 3);
      ctx.fillStyle = theme.editorBg;
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = theme.panelBorder;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = theme.editorFg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, point.x, point.y - 0.5);
      ctx.restore();
    };

    if (edge.source.multiplicity) drawMultiplicity(item.startMultiplicityPoint, edge.source.multiplicity);
    if (edge.target.multiplicity) drawMultiplicity(item.endMultiplicityPoint, edge.target.multiplicity);

    if (edge.label) {
      ctx.save();
      ctx.font = `11px ${theme.fontFamily}`;
      const metrics = ctx.measureText(edge.label);
      const widthBadge = Math.max(edge.label.length * 7.6 + 16, metrics.width + 16);
      drawRoundRect(geometry.labelPoint.x - widthBadge / 2, geometry.labelPoint.y - 10, widthBadge, 20, 4);
      ctx.fillStyle = theme.widgetBg;
      ctx.fill();
      ctx.strokeStyle = theme.panelBorder;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = theme.editorFg;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.label, geometry.labelPoint.x, geometry.labelPoint.y);
      ctx.restore();
    }
  }

  // Non-frame nodes
  for (const node of doc.nodes) {
    if (node.kind === 'frame') continue;
    const box = layouts[node.id];
    if (!box) continue;

    if (node.kind === 'shape') {
      ctx.save();
      ctx.translate(box.x, box.y);
      const path = new Path2D(buildShapeSvgPath(node.shape, box.width, box.height));
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = theme.widgetBg;
      ctx.fill(path);
      ctx.restore();
      ctx.strokeStyle = theme.nodeBorder;
      ctx.lineWidth = 1.75;
      ctx.lineJoin = 'round';
      ctx.stroke(path);
      ctx.fillStyle = theme.editorFg;
      ctx.font = `600 13px ${theme.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.name || '', box.width / 2, box.height / 2);
      ctx.restore();
      continue;
    }

    const kindDescriptor = getUmlNodeKind(node.kind);
    const stereotype = node.stereotype || kindDescriptor?.defaultStereotype || (!kindDescriptor ? `unsupported: ${node.kind}` : '');
    const headerHeight = node.kind === 'note' ? 30 : stereotype ? 42 : 30;

    ctx.save();
    ctx.translate(box.x, box.y);

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    drawRoundRect(0, 0, box.width, box.height, 5);
    ctx.fillStyle = node.kind === 'note' ? theme.noteBg : theme.widgetBg;
    ctx.fill();
    ctx.restore();

    drawRoundRect(0, 0, box.width, box.height, 5);
    ctx.strokeStyle = theme.nodeBorder;
    ctx.lineWidth = 1.5;
    if (node.kind === 'note') ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    drawRoundRect(0, 0, box.width, box.height, 5);
    ctx.clip();

    if (stereotype) {
      ctx.fillStyle = theme.descriptionFg;
      ctx.font = `11px ${theme.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`«${stereotype}»`, box.width / 2, 7);
    }

    ctx.fillStyle = theme.editorFg;
    ctx.font = `600 13px ${theme.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(node.name || '', box.width / 2, stereotype ? 22 : (headerHeight - 16) / 2);

    ctx.strokeStyle = theme.panelBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, headerHeight);
    ctx.lineTo(box.width, headerHeight);
    ctx.stroke();

    let currentY = headerHeight;

    if (node.kind === 'note') {
      const content = node.text || '';
      const contentFont = `12px ${theme.fontFamily}`;
      ctx.font = contentFont;
      ctx.fillStyle = theme.editorFg;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const padX = 10;
      const lineHeight = 16.8;
      let lineY = headerHeight + 8;
      const maxWidth = box.width - padX * 2;

      for (const rawLine of content.split('\n')) {
        if (lineY + lineHeight > box.height) break;
        if (!rawLine) {
          lineY += lineHeight;
          continue;
        }
        let currentLine = '';
        for (const word of rawLine.split(' ')) {
          const candidate = currentLine ? `${currentLine} ${word}` : word;
          if (ctx.measureText(candidate).width > maxWidth && currentLine) {
            ctx.fillText(currentLine, padX, lineY);
            lineY += lineHeight;
            if (lineY + lineHeight > box.height) break;
            currentLine = word;
          } else {
            currentLine = candidate;
          }
        }
        if (currentLine && lineY + lineHeight <= box.height + 4) {
          ctx.fillText(currentLine, padX, lineY);
          lineY += lineHeight;
        }
      }
    } else {
      const memberLineHeight = 16.7;
      const memberPadX = 8;

      const attributes = node.showAttributes !== false ? (node.attributes ?? []) : [];
      if (attributes.length > 0) {
        let lineY = currentY + 5;
        for (const attribute of attributes) {
          ctx.font = `bold 11.5px ${theme.monoFamily}`;
          ctx.fillStyle = theme.editorFg;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(formatVisibilitySign(attribute.visibility), memberPadX, lineY);

          const nameX = memberPadX + 16;
          ctx.font = `11.5px ${theme.monoFamily}`;
          ctx.fillText(attribute.name || '', nameX, lineY);
          if (attribute.type) {
            const nameWidth = ctx.measureText(attribute.name || '').width;
            ctx.fillStyle = theme.descriptionFg;
            ctx.fillText(`: ${attribute.type}`, nameX + nameWidth, lineY);
          }
          lineY += memberLineHeight;
        }
        currentY = lineY + 5;
        ctx.strokeStyle = theme.panelBorder;
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(box.width, currentY);
        ctx.stroke();
      }

      const operations = node.showOperations !== false ? (node.operations ?? []) : [];
      if (operations.length > 0) {
        let lineY = currentY + 5;
        for (const operation of operations) {
          ctx.font = `bold 11.5px ${theme.monoFamily}`;
          ctx.fillStyle = theme.editorFg;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(formatVisibilitySign(operation.visibility), memberPadX, lineY);

          const nameX = memberPadX + 16;
          ctx.font = `11.5px ${theme.monoFamily}`;
          const parameters = extractOperationParameters(operation)
            .map((parameter) => parameter.name + (parameter.type ? `: ${parameter.type}` : ''))
            .join(', ');
          const signature = `${operation.name || ''}(${parameters})`;
          ctx.fillText(signature, nameX, lineY);
          if (operation.returnType) {
            const signatureWidth = ctx.measureText(signature).width;
            ctx.fillStyle = theme.descriptionFg;
            ctx.fillText(`: ${operation.returnType}`, nameX + signatureWidth, lineY);
          }
          lineY += memberLineHeight;
        }
      }
    }

    ctx.restore();
    ctx.restore();
  }

  return { canvas, width, height };
}

export function canvasToPngBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
}
