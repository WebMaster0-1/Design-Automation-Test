#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════
 * FMDQ Design Automation — Figma Token Extractor
 * ═══════════════════════════════════════════════════════════════
 *
 * Connects to the Figma REST API, extracts published styles
 * (colors, typography, effects) from the Design System Kit file,
 * and writes:
 *   - src/tokens.json   (raw structured data)
 *   - src/tokens.css     (CSS custom properties, preserving format)
 *
 * Usage:
 *   node scripts/figma-extractor.mjs                # full sync
 *   node scripts/figma-extractor.mjs --tokens-only  # tokens only, no component scan
 *   node scripts/figma-extractor.mjs --dry-run      # preview without writing files
 *
 * Requires env vars: FIGMA_ACCESS_TOKEN, FIGMA_FILE_KEY
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TOKENS_CSS_PATH = path.join(ROOT, 'src', 'tokens.css');
const TOKENS_JSON_PATH = path.join(ROOT, 'src', 'tokens.json');

// ─── Load .env manually (no external deps) ───────────────────
function loadEnv() {
  const envPath = path.join(ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const FIGMA_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;
const API_BASE = 'https://api.figma.com/v1';

const flags = new Set(process.argv.slice(2).map(a => a.toLowerCase()));
const DRY_RUN = flags.has('--dry-run');
const TOKENS_ONLY = flags.has('--tokens-only');

// ─── Helpers ──────────────────────────────────────────────────
function die(msg) {
  console.error(`\n❌  ${msg}\n`);
  process.exit(1);
}

function info(msg) {
  console.log(`  ℹ  ${msg}`);
}

function success(msg) {
  console.log(`  ✅  ${msg}`);
}

async function figmaGet(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    die(`Figma API ${res.status} at ${endpoint}\n${body}`);
  }
  return res.json();
}

// ─── Color extraction ─────────────────────────────────────────
function rgbaToHex({ r, g, b, a }) {
  const to255 = (v) => Math.round((v ?? 0) * 255);
  const hex = [r, g, b].map(to255).map(v => v.toString(16).padStart(2, '0')).join('');
  if (a !== undefined && a < 1) {
    const alphaHex = to255(a).toString(16).padStart(2, '0');
    return `#${hex}${alphaHex}`;
  }
  return `#${hex}`;
}

function figmaColorToCSS(paint) {
  if (!paint || paint.type !== 'SOLID') return null;
  return rgbaToHex(paint.color);
}

// ─── Typography extraction ────────────────────────────────────
function extractTypography(style) {
  const result = {};
  if (style.fontFamily) result.fontFamily = style.fontFamily;
  if (style.fontSize) result.fontSize = `${style.fontSize}px`;
  if (style.fontWeight) result.fontWeight = style.fontWeight;
  if (style.lineHeightPx) result.lineHeight = `${style.lineHeightPx}px`;
  if (style.lineHeightPercent) result.lineHeightPercent = `${style.lineHeightPercent}%`;
  if (style.letterSpacing) result.letterSpacing = `${style.letterSpacing}px`;
  return result;
}

// ─── Effect extraction ────────────────────────────────────────
function effectToCSS(effect) {
  if (!effect || !effect.visible) return null;
  const { type, color, offset, radius, spread } = effect;
  if (type === 'DROP_SHADOW' || type === 'INNER_SHADOW') {
    const rgba = color
      ? `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${(color.a ?? 1).toFixed(2)})`
      : 'rgba(0,0,0,0.1)';
    const x = offset?.x ?? 0;
    const y = offset?.y ?? 0;
    const r = radius ?? 0;
    const s = spread ?? 0;
    const inset = type === 'INNER_SHADOW' ? 'inset ' : '';
    return `${inset}${x}px ${y}px ${r}px ${s}px ${rgba}`;
  }
  return null;
}

// ─── Token name sanitiser ─────────────────────────────────────
function styleName2VarName(name) {
  return '--' + name
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();
}

// ─── Main extraction flow ─────────────────────────────────────
async function extractTokens() {
  console.log('\n🎨 FMDQ Figma Token Extractor');
  console.log('═'.repeat(50));

  if (!FIGMA_TOKEN) die('FIGMA_ACCESS_TOKEN is not set. See .env.example');
  if (!FIGMA_FILE_KEY) die('FIGMA_FILE_KEY is not set. See .env.example');

  // 1. Fetch file styles
  info('Fetching published styles from Figma...');
  const { meta } = await figmaGet(`/files/${FIGMA_FILE_KEY}/styles`);
  const styles = meta?.styles ?? [];
  info(`Found ${styles.length} published styles`);

  if (styles.length === 0) {
    console.warn('  ⚠  No published styles found in this file. Make sure styles are published in Figma.');
  }

  // 2. Collect node IDs we need to inspect
  const nodeIds = styles.map(s => s.node_id);

  // 3. Fetch all style nodes in a single request
  info('Fetching node details...');
  const nodesData = await figmaGet(`/files/${FIGMA_FILE_KEY}/nodes?ids=${nodeIds.join(',')}`);
  const nodes = nodesData.nodes ?? {};

  // 4. Parse into structured tokens
  const tokens = {
    colors: {},
    typography: {},
    effects: {},
    _meta: {
      source: `figma://file/${FIGMA_FILE_KEY}`,
      extractedAt: new Date().toISOString(),
      styleCount: styles.length
    }
  };

  for (const styleDef of styles) {
    const nodeWrapper = nodes[styleDef.node_id];
    if (!nodeWrapper || !nodeWrapper.document) continue;
    const node = nodeWrapper.document;
    const varName = styleName2VarName(styleDef.name);

    switch (styleDef.style_type) {
      case 'FILL': {
        const fills = node.fills ?? [];
        const solidFill = fills.find(f => f.type === 'SOLID' && f.visible !== false);
        if (solidFill) {
          const hex = figmaColorToCSS(solidFill);
          if (hex) tokens.colors[varName] = hex;
        }
        break;
      }
      case 'TEXT': {
        const typo = extractTypography(node.style ?? {});
        if (Object.keys(typo).length > 0) {
          tokens.typography[varName] = typo;
        }
        break;
      }
      case 'EFFECT': {
        const effects = (node.effects ?? []).filter(e => e.visible !== false);
        const cssEffects = effects.map(effectToCSS).filter(Boolean);
        if (cssEffects.length > 0) {
          tokens.effects[varName] = cssEffects.join(', ');
        }
        break;
      }
      default:
        break;
    }
  }

  success(`Extracted ${Object.keys(tokens.colors).length} colors, ${Object.keys(tokens.typography).length} typography styles, ${Object.keys(tokens.effects).length} effects`);

  return tokens;
}

// ─── CSS Generation ───────────────────────────────────────────
function generateCSS(tokens) {
  const lines = [':root {'];

  // Read existing tokens.css to preserve manually-added tokens
  let existingVars = {};
  if (fs.existsSync(TOKENS_CSS_PATH)) {
    const existing = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');
    const varRegex = /--([\w-]+)\s*:\s*(.+?)\s*;/g;
    let match;
    while ((match = varRegex.exec(existing)) !== null) {
      existingVars[`--${match[1]}`] = match[2];
    }
  }

  // Colors
  if (Object.keys(tokens.colors).length > 0) {
    lines.push('  /* ── Colors (synced from Figma) ── */');
    for (const [name, value] of Object.entries(tokens.colors)) {
      lines.push(`  ${name}: ${value};`);
      delete existingVars[name]; // Remove from existing so we don't duplicate
    }
    lines.push('');
  }

  // Typography
  if (Object.keys(tokens.typography).length > 0) {
    lines.push('  /* ── Typography (synced from Figma) ── */');
    for (const [name, style] of Object.entries(tokens.typography)) {
      if (style.fontFamily) {
        lines.push(`  ${name}-family: '${style.fontFamily}', sans-serif;`);
        delete existingVars[`${name}-family`];
      }
      if (style.fontSize) {
        lines.push(`  ${name}-size: ${style.fontSize};`);
        delete existingVars[`${name}-size`];
      }
      if (style.fontWeight) {
        lines.push(`  ${name}-weight: ${style.fontWeight};`);
        delete existingVars[`${name}-weight`];
      }
      if (style.lineHeight) {
        lines.push(`  ${name}-line-height: ${style.lineHeight};`);
        delete existingVars[`${name}-line-height`];
      }
      if (style.letterSpacing) {
        lines.push(`  ${name}-letter-spacing: ${style.letterSpacing};`);
        delete existingVars[`${name}-letter-spacing`];
      }
    }
    lines.push('');
  }

  // Effects
  if (Object.keys(tokens.effects).length > 0) {
    lines.push('  /* ── Effects (synced from Figma) ── */');
    for (const [name, value] of Object.entries(tokens.effects)) {
      lines.push(`  ${name}: ${value};`);
      delete existingVars[name];
    }
    lines.push('');
  }

  // Preserve any manually-defined tokens not from Figma
  const remaining = Object.entries(existingVars);
  if (remaining.length > 0) {
    lines.push('  /* ── Manual Overrides (preserved) ── */');
    for (const [name, value] of remaining) {
      lines.push(`  ${name}: ${value};`);
    }
    lines.push('');
  }

  lines.push('}');
  return lines.join('\n') + '\n';
}

// ─── Component listing (non-tokens-only mode) ─────────────────
async function listComponents() {
  info('Fetching component inventory...');
  const { meta } = await figmaGet(`/files/${FIGMA_FILE_KEY}/components`);
  const components = meta?.components ?? [];
  info(`Found ${components.length} components in Figma file`);

  const summary = components.map(c => ({
    name: c.name,
    description: c.description || '(no description)',
    containingFrame: c.containing_frame?.name || 'root',
    nodeId: c.node_id
  }));

  return summary;
}

// ─── Entrypoint ───────────────────────────────────────────────
async function main() {
  const tokens = await extractTokens();

  let components = [];
  if (!TOKENS_ONLY) {
    components = await listComponents();
    info(`Component inventory: ${components.length} components catalogued`);
  }

  if (DRY_RUN) {
    console.log('\n📋 DRY RUN — No files written\n');
    console.log('Tokens:', JSON.stringify(tokens, null, 2));
    if (components.length > 0) {
      console.log('\nComponents:', JSON.stringify(components.slice(0, 10), null, 2));
      if (components.length > 10) console.log(`  ... and ${components.length - 10} more`);
    }
    return;
  }

  // Write tokens.json
  const jsonPayload = { ...tokens, components: components.slice(0, 100) };
  fs.writeFileSync(TOKENS_JSON_PATH, JSON.stringify(jsonPayload, null, 2) + '\n', 'utf-8');
  success(`Written ${TOKENS_JSON_PATH}`);

  // Write tokens.css (merges with existing manual tokens)
  const css = generateCSS(tokens);
  fs.writeFileSync(TOKENS_CSS_PATH, css, 'utf-8');
  success(`Written ${TOKENS_CSS_PATH}`);

  console.log('\n✨ Figma sync complete!\n');
}

main().catch(err => {
  console.error('\n💥 Extraction failed:', err.message);
  process.exit(1);
});
