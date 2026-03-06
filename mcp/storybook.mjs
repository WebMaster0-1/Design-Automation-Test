import process from 'node:process';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const storybookBaseUrl = (process.env.STORYBOOK_URL || 'http://localhost:6006').replace(/\/+$/, '');
const indexUrl = `${storybookBaseUrl}/index.json`;

const server = new McpServer({
  name: 'storybook-local',
  version: '0.1.0'
});

let cachedIndex = null;
let cachedAtMs = 0;
const CACHE_TTL_MS = 1500;

async function getIndexJson() {
  const now = Date.now();
  if (cachedIndex && now - cachedAtMs < CACHE_TTL_MS) return cachedIndex;

  const res = await fetch(indexUrl, {
    headers: { accept: 'application/json' }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch Storybook index.json (${res.status} ${res.statusText}) from ${indexUrl}`);
  }

  const json = await res.json();
  if (!json || typeof json !== 'object' || !json.entries || typeof json.entries !== 'object') {
    throw new Error(`Unexpected index.json shape from ${indexUrl}`);
  }

  cachedIndex = json;
  cachedAtMs = now;
  return json;
}

function makeStorybookUrl(entryId, viewMode) {
  const vm = viewMode === 'docs' ? 'docs' : 'story';
  return `${storybookBaseUrl}/?path=/${vm}/${encodeURIComponent(entryId)}`;
}

const EntrySchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  name: z.string().optional(),
  type: z.enum(['story', 'docs']).optional(),
  importPath: z.string().optional(),
  componentPath: z.string().optional(),
  tags: z.array(z.string()).optional(),
  url: z.string()
});

server.registerTool(
  'storybook_health',
  {
    title: 'Storybook health',
    description: 'Checks whether the configured Storybook dev server is reachable.',
    inputSchema: z.object({}),
    outputSchema: z.object({
      baseUrl: z.string(),
      indexUrl: z.string(),
      ok: z.boolean(),
      entryCount: z.number()
    })
  },
  async () => {
    const index = await getIndexJson();
    const entryCount = Object.keys(index.entries ?? {}).length;
    const structuredContent = { baseUrl: storybookBaseUrl, indexUrl, ok: true, entryCount };
    return {
      content: [
        {
          type: 'text',
          text: `Storybook is reachable at ${storybookBaseUrl}. Found ${entryCount} entries.`
        }
      ],
      structuredContent
    };
  }
);

server.registerTool(
  'storybook_list_entries',
  {
    title: 'List Storybook entries',
    description: 'Lists stories/docs entries from the local Storybook at STORYBOOK_URL.',
    inputSchema: z.object({
      query: z.string().optional().describe('Case-insensitive filter over title/name/id/importPath.'),
      type: z.enum(['story', 'docs', 'any']).optional().default('any'),
      limit: z.number().int().min(1).max(500).optional().default(200)
    }),
    outputSchema: z.object({
      baseUrl: z.string(),
      entries: z.array(EntrySchema)
    })
  },
  async ({ query, type, limit }) => {
    const index = await getIndexJson();
    const entriesObj = index.entries ?? {};
    const q = query?.trim().toLowerCase();
    const wantType = type && type !== 'any' ? type : null;

    const out = [];
    for (const [id, entry] of Object.entries(entriesObj)) {
      if (!entry || typeof entry !== 'object') continue;

      const entryType = typeof entry.type === 'string' ? entry.type : undefined;
      if (wantType && entryType && entryType !== wantType) continue;
      if (wantType && !entryType) continue;

      if (q) {
        const haystack = [
          id,
          entry.title,
          entry.name,
          entry.importPath,
          entry.componentPath
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) continue;
      }

      const viewMode = entryType === 'docs' ? 'docs' : 'story';
      out.push({
        id,
        title: entry.title,
        name: entry.name,
        type: entryType,
        importPath: entry.importPath,
        componentPath: entry.componentPath,
        tags: entry.tags,
        url: makeStorybookUrl(id, viewMode)
      });

      if (out.length >= limit) break;
    }

    const structuredContent = { baseUrl: storybookBaseUrl, entries: out };
    return {
      content: [
        {
          type: 'text',
          text: `Found ${out.length} Storybook entries from ${indexUrl}.`
        }
      ],
      structuredContent
    };
  }
);

server.registerTool(
  'storybook_get_entry',
  {
    title: 'Get Storybook entry',
    description: 'Fetch a single Storybook entry by id.',
    inputSchema: z.object({
      id: z.string(),
      viewMode: z.enum(['story', 'docs', 'auto']).optional().default('auto')
    }),
    outputSchema: z.object({
      baseUrl: z.string(),
      entry: EntrySchema
    })
  },
  async ({ id, viewMode }) => {
    const index = await getIndexJson();
    const entry = index.entries?.[id];
    if (!entry) {
      return {
        content: [{ type: 'text', text: `Entry not found: ${id}` }],
        isError: true
      };
    }

    const entryType = typeof entry.type === 'string' ? entry.type : undefined;
    const vm = viewMode === 'auto' ? (entryType === 'docs' ? 'docs' : 'story') : viewMode;
    const outEntry = {
      id,
      title: entry.title,
      name: entry.name,
      type: entryType,
      importPath: entry.importPath,
      componentPath: entry.componentPath,
      tags: entry.tags,
      url: makeStorybookUrl(id, vm)
    };

    const structuredContent = { baseUrl: storybookBaseUrl, entry: outEntry };
    return {
      content: [{ type: 'text', text: outEntry.url }],
      structuredContent
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});

