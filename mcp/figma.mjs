#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════
 * FMDQ Design Automation — Figma MCP Server
 * ═══════════════════════════════════════════════════════════════
 *
 * An MCP server that exposes Figma inspection tools to AI agents.
 * Enables real-time querying of the Figma Design System Kit
 * directly from within the code editor.
 *
 * Tools provided:
 *   - figma_health         — Validate token and file accessibility
 *   - figma_get_styles     — List all published styles
 *   - figma_get_components — List all published components
 *   - figma_get_node       — Inspect a specific node by ID
 *   - figma_diff_tokens    — Compare Figma styles vs local tokens.css
 *
 * Requires env vars: FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY
 */

import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOKENS_CSS_PATH = path.join(ROOT, 'src', 'tokens.css');

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN || '';
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || '';
const API_BASE = 'https://api.figma.com/v1';

const server = new McpServer({
  name: 'figma-design-sync',
  version: '0.1.0'
});

// ─── Figma API helper ─────────────────────────────────────────
async function figmaGet(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Figma API ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

// ─── RGBA → hex ───────────────────────────────────────────────
function rgbaToHex({ r, g, b, a }) {
  const to255 = (v) => Math.round((v ?? 0) * 255);
  const hex = [r, g, b].map(to255).map(v => v.toString(16).padStart(2, '0')).join('');
  if (a !== undefined && a < 1) {
    return `#${hex}${to255(a).toString(16).padStart(2, '0')}`;
  }
  return `#${hex}`;
}

// ─── Parse existing tokens.css ────────────────────────────────
function parseLocalTokens() {
  if (!fs.existsSync(TOKENS_CSS_PATH)) return {};
  const content = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');
  const vars = {};
  const regex = /--([\w-]+)\s*:\s*(.+?)\s*;/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    vars[`--${match[1]}`] = match[2];
  }
  return vars;
}

// ═══ Tool: figma_health ═══════════════════════════════════════
server.registerTool(
  'figma_health',
  {
    title: 'Figma connection health',
    description: 'Checks whether the Figma API is reachable with the configured token and file key.',
    inputSchema: z.object({})
  },
  async () => {
    if (!FIGMA_TOKEN) {
      return {
        content: [{ type: 'text', text: '❌ FIGMA_ACCESS_TOKEN is not set.' }],
        isError: true
      };
    }
    if (!FIGMA_FILE_KEY) {
      return {
        content: [{ type: 'text', text: '❌ FIGMA_FILE_KEY is not set.' }],
        isError: true
      };
    }

    try {
      const data = await figmaGet(`/files/${FIGMA_FILE_KEY}?depth=1`);
      const fileName = data.name || 'Unknown';
      const lastModified = data.lastModified || 'unknown';
      return {
        content: [{
          type: 'text',
          text: `✅ Connected to Figma file "${fileName}" (last modified: ${lastModified})`
        }]
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `❌ Figma API error: ${err.message}` }],
        isError: true
      };
    }
  }
);

// ═══ Tool: figma_get_styles ═══════════════════════════════════
server.registerTool(
  'figma_get_styles',
  {
    title: 'Get Figma styles',
    description: 'Lists all published styles (colors, typography, effects) from the Figma file.',
    inputSchema: z.object({
      type: z.enum(['FILL', 'TEXT', 'EFFECT', 'GRID', 'all']).optional().default('all')
        .describe('Filter by style type, or "all" for everything.')
    })
  },
  async ({ type }) => {
    const { meta } = await figmaGet(`/files/${FIGMA_FILE_KEY}/styles`);
    let styles = meta?.styles ?? [];

    if (type !== 'all') {
      styles = styles.filter(s => s.style_type === type);
    }

    const summary = styles.map(s => ({
      name: s.name,
      type: s.style_type,
      description: s.description || '',
      nodeId: s.node_id
    }));

    return {
      content: [{
        type: 'text',
        text: `Found ${summary.length} styles:\n${summary.map(s => `  • [${s.type}] ${s.name}`).join('\n')}`
      }]
    };
  }
);

// ═══ Tool: figma_get_components ═══════════════════════════════
server.registerTool(
  'figma_get_components',
  {
    title: 'Get Figma components',
    description: 'Lists all published components from the Figma Design System Kit.',
    inputSchema: z.object({
      query: z.string().optional().describe('Case-insensitive filter over component names.')
    })
  },
  async ({ query }) => {
    const { meta } = await figmaGet(`/files/${FIGMA_FILE_KEY}/components`);
    let components = meta?.components ?? [];

    if (query) {
      const q = query.toLowerCase();
      components = components.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q)
      );
    }

    const summary = components.map(c => ({
      name: c.name,
      description: c.description || '',
      frame: c.containing_frame?.name || 'root',
      nodeId: c.node_id
    }));

    return {
      content: [{
        type: 'text',
        text: `Found ${summary.length} components:\n${summary.map(c => `  • ${c.name} (in "${c.frame}")`).join('\n')}`
      }]
    };
  }
);

// ═══ Tool: figma_get_node ═════════════════════════════════════
server.registerTool(
  'figma_get_node',
  {
    title: 'Inspect Figma node',
    description: 'Fetches detailed properties of a specific Figma node by its ID. Returns dimensions, fills, strokes, typography, and effects.',
    inputSchema: z.object({
      nodeId: z.string().describe('The Figma node ID to inspect (e.g. "123:456").')
    })
  },
  async ({ nodeId }) => {
    const data = await figmaGet(`/files/${FIGMA_FILE_KEY}/nodes?ids=${encodeURIComponent(nodeId)}`);
    const nodeWrapper = data.nodes?.[nodeId];

    if (!nodeWrapper || !nodeWrapper.document) {
      return {
        content: [{ type: 'text', text: `Node ${nodeId} not found.` }],
        isError: true
      };
    }

    const node = nodeWrapper.document;
    const props = {
      id: nodeId,
      name: node.name,
      type: node.type,
      visible: node.visible !== false,
      size: node.absoluteBoundingBox
        ? { width: node.absoluteBoundingBox.width, height: node.absoluteBoundingBox.height }
        : null,
      fills: (node.fills ?? []).filter(f => f.visible !== false).map(f => {
        if (f.type === 'SOLID') return { type: 'SOLID', color: rgbaToHex(f.color), opacity: f.opacity };
        return { type: f.type };
      }),
      strokes: (node.strokes ?? []).filter(s => s.visible !== false).map(s => {
        if (s.type === 'SOLID') return { type: 'SOLID', color: rgbaToHex(s.color) };
        return { type: s.type };
      }),
      strokeWeight: node.strokeWeight,
      cornerRadius: node.cornerRadius,
      typography: node.style ? {
        fontFamily: node.style.fontFamily,
        fontSize: node.style.fontSize,
        fontWeight: node.style.fontWeight,
        lineHeight: node.style.lineHeightPx,
        letterSpacing: node.style.letterSpacing
      } : null,
      effects: (node.effects ?? []).filter(e => e.visible !== false).map(e => ({
        type: e.type,
        radius: e.radius,
        offset: e.offset,
        color: e.color ? rgbaToHex(e.color) : null
      })),
      padding: node.paddingLeft !== undefined ? {
        top: node.paddingTop,
        right: node.paddingRight,
        bottom: node.paddingBottom,
        left: node.paddingLeft
      } : null,
      gap: node.itemSpacing
    };

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(props, null, 2)
      }]
    };
  }
);

// ═══ Tool: figma_diff_tokens ══════════════════════════════════
server.registerTool(
  'figma_diff_tokens',
  {
    title: 'Diff Figma tokens vs local',
    description: 'Compares the published color styles in Figma against the local src/tokens.css file to identify additions, changes, and removals.',
    inputSchema: z.object({})
  },
  async () => {
    // 1. Get Figma styles
    const { meta } = await figmaGet(`/files/${FIGMA_FILE_KEY}/styles`);
    const fillStyles = (meta?.styles ?? []).filter(s => s.style_type === 'FILL');

    // 2. Get node details for fills
    if (fillStyles.length === 0) {
      return { content: [{ type: 'text', text: 'No published FILL styles found in Figma.' }] };
    }

    const nodeIds = fillStyles.map(s => s.node_id).join(',');
    const nodesData = await figmaGet(`/files/${FIGMA_FILE_KEY}/nodes?ids=${nodeIds}`);
    const nodes = nodesData.nodes ?? {};

    const figmaColors = {};
    for (const style of fillStyles) {
      const node = nodes[style.node_id]?.document;
      if (!node) continue;
      const solidFill = (node.fills ?? []).find(f => f.type === 'SOLID' && f.visible !== false);
      if (solidFill) {
        const varName = '--' + style.name
          .replace(/\//g, '-').replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '').replace(/-+/g, '-')
          .toLowerCase();
        figmaColors[varName] = rgbaToHex(solidFill.color);
      }
    }

    // 3. Parse local tokens
    const localTokens = parseLocalTokens();

    // 4. Compute diff
    const added = [];
    const changed = [];
    const removed = [];

    for (const [name, figmaVal] of Object.entries(figmaColors)) {
      if (!(name in localTokens)) {
        added.push({ name, figmaValue: figmaVal });
      } else if (localTokens[name].toLowerCase() !== figmaVal.toLowerCase()) {
        changed.push({ name, localValue: localTokens[name], figmaValue: figmaVal });
      }
    }

    // Color-specific tokens in local that aren't in Figma
    for (const [name, val] of Object.entries(localTokens)) {
      if (name.includes('color') && !(name in figmaColors)) {
        removed.push({ name, localValue: val });
      }
    }

    const lines = ['Token Diff Report', '═'.repeat(40)];
    if (added.length > 0) {
      lines.push(`\n🟢 NEW (${added.length}):`);
      added.forEach(a => lines.push(`  + ${a.name}: ${a.figmaValue}`));
    }
    if (changed.length > 0) {
      lines.push(`\n🟡 CHANGED (${changed.length}):`);
      changed.forEach(c => lines.push(`  ~ ${c.name}: ${c.localValue} → ${c.figmaValue}`));
    }
    if (removed.length > 0) {
      lines.push(`\n🔴 LOCAL-ONLY (${removed.length}):`);
      removed.forEach(r => lines.push(`  - ${r.name}: ${r.localValue}`));
    }
    if (added.length === 0 && changed.length === 0 && removed.length === 0) {
      lines.push('\n✅ All color tokens are in sync!');
    }

    return { content: [{ type: 'text', text: lines.join('\n') }] };
  }
);

// ─── Start server ─────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
