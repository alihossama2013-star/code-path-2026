import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Code2,
  Columns2,
  Globe,
  Play,
  RotateCcw,
  Terminal,
  Trash2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { extractHtmlTitle } from '../data/exerciseTasks';
import { PlaygroundStarter } from '../data/types';
import { EASE_SETTLE, SPRING_SNAPPY } from './MotionPrimitives';

type SimulatorMode = 'preview' | 'edit' | 'split';

interface CodeSimulatorProps {
  initialCode: string;
  language?: string;
  starterBundle?: PlaygroundStarter;
  defaultOpen?: boolean;
  compact?: boolean;
  externalRunNonce?: number;
  hideCollapse?: boolean;
  titleLabel?: string;
}

interface ParsedHeadInfo {
  hasDoctype: boolean;
  htmlAttrs: string;
  title: string;
  metas: string[];
  links: string[];
  bases: string[];
}

const BASE_SIMULATOR_CSS = `
*, *::before, *::after { box-sizing: border-box; }
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin: 0;
  padding: 16px 20px;
  line-height: 1.6;
  color: #111111;
  background: #ffffff;
  font-size: 14px;
}
h1, h2, h3, h4, h5, h6 { margin: 0 0 8px; line-height: 1.3; }
p { margin: 0 0 10px; }
ul, ol, dl { margin: 6px 0 10px; padding-inline-start: 20px; }
table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 13px; }
th, td { border: 1px solid #d4d4d4; padding: 6px 10px; text-align: left; }
th { background: #f5f5f5; font-weight: 600; }
pre, code, kbd, samp, var { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
pre {
  background: #f5f5f5;
  padding: 10px 12px;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  overflow-x: auto;
  margin: 8px 0;
  font-size: 12.5px;
}
kbd {
  border: 1px solid #cccccc;
  background: #f5f5f5;
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 12px;
}
mark { background: #fef08a; padding: 0 3px; }
blockquote {
  border-left: 3px solid #111111;
  margin: 8px 0;
  padding: 4px 12px;
  color: #444444;
}
button {
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
  padding: 6px 12px;
  border: 1px solid #111111;
  background: #111111;
  color: #ffffff;
  border-radius: 4px;
}
button:hover { background: #2b2b2b; }
input, select, textarea {
  font-family: inherit;
  font-size: 13px;
  padding: 5px 8px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background: #ffffff;
  color: #111111;
}
fieldset { border: 1px solid #d4d4d4; border-radius: 4px; padding: 10px 14px; }
details { border: 1px solid #e7e7e7; border-radius: 4px; padding: 8px 12px; }
summary { cursor: pointer; font-weight: 600; }
dialog[open] {
  border: 1px solid #111111;
  border-radius: 4px;
  padding: 12px 16px;
  position: static;
  margin: 8px 0;
}
a { color: #111111; text-decoration: underline; }
hr { border: 0; border-top: 1px solid #e7e7e7; margin: 12px 0; }
img, video, audio { max-width: 100%; }
`;

function parseHeadMetadata(html: string): ParsedHeadInfo {
  const hasDoctype = /<!doctype\s+html/i.test(html);
  const htmlAttrMatch = html.match(/<html([^>]*)>/i);
  const htmlAttrs = htmlAttrMatch ? htmlAttrMatch[1].trim() : '';
  const title = extractHtmlTitle(html);

  const metas: string[] = [];
  const metaRegex = /<meta\s+([^>]+?)\s*\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRegex.exec(html)) !== null) {
    metas.push(`<meta ${m[1].trim()}>`);
  }

  const links: string[] = [];
  const linkRegex = /<link\s+([^>]+?)\s*\/?>/gi;
  while ((m = linkRegex.exec(html)) !== null) {
    links.push(`<link ${m[1].trim()}>`);
  }

  const bases: string[] = [];
  const baseRegex = /<base\s+([^>]+?)\s*\/?>/gi;
  while ((m = baseRegex.exec(html)) !== null) {
    bases.push(`<base ${m[1].trim()}>`);
  }

  return { hasDoctype, htmlAttrs, title, metas, links, bases };
}

function hasVisibleBodyContent(html: string): boolean {
  const stripped = html
    .replace(/<!doctype[^>]*>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<(title|meta|link|base|style|script)[\s\S]*?(?:\/>|<\/\1>)/gi, '')
    .replace(/<\/?(html|head|body)[^>]*>/gi, '')
    .trim();
  return stripped.length > 0;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMetadataPreviewHtml(info: ParsedHeadInfo, headingLabel: string): string {
  const rows: { key: string; value: string }[] = [];
  if (info.hasDoctype) rows.push({ key: '<!DOCTYPE>', value: 'html (HTML5 Standards Mode)' });
  if (info.htmlAttrs) rows.push({ key: '<html>', value: info.htmlAttrs });
  if (info.title) rows.push({ key: '<title>', value: info.title });
  info.metas.forEach((meta, i) => rows.push({ key: `<meta #${i + 1}>`, value: meta }));
  info.links.forEach((lnk, i) => rows.push({ key: `<link #${i + 1}>`, value: lnk }));
  info.bases.forEach((bs, i) => rows.push({ key: `<base #${i + 1}>`, value: bs }));

  if (rows.length === 0) {
    return `<div style="border:1px solid #e7e7e7;border-radius:4px;padding:12px 14px;background:#fafafa;font-size:13px;color:#555555;">
      ${escapeHtml(headingLabel)}: Document structure parsed successfully.
    </div>`;
  }

  return `<div style="border:1px solid #e7e7e7;border-radius:4px;background:#fafafa;overflow:hidden;">
    <div style="padding:8px 12px;border-bottom:1px solid #e7e7e7;background:#f5f5f5;font-size:11px;font-weight:600;color:#555555;">
      ${escapeHtml(headingLabel)}
    </div>
    <div style="padding:10px 12px;display:flex;flex-direction:column;gap:6px;font-family:ui-monospace,monospace;font-size:12px;">
      ${rows
        .map(
          (r) =>
            `<div style="display:flex;gap:10px;align-items:baseline;"><span style="color:#777777;min-width:96px;flex-shrink:0;">${escapeHtml(
              r.key
            )}</span><span style="color:#111111;word-break:break-word;">${escapeHtml(
              r.value
            )}</span></div>`
        )
        .join('')}
    </div>
  </div>`;
}

/**
 * Lightweight deterministic JSX -> h() compiler for inline educational React/TSX previews.
 * Works offline/hermetically without external CDN scripts.
 */
function compileSimpleTsxToJs(source: string): { js: string; componentName: string | null } {
  let code = source
    .replace(/\bexport\s+default\s+/g, '')
    .replace(/\bexport\s+/g, '')
    .replace(/\bimport\s+[\s\S]*?;\s*/g, '');

  // Remove TS param type annotations like `({ completed }: { completed: number })`
  code = code.replace(/\(\s*(\{[^}]*\})\s*:\s*\{[^}]*\}\s*\)/g, '($1)');
  // Remove simple `: type` annotations in params e.g. `(n: number)`
  code = code.replace(/(\w+)\s*:\s*(number|string|boolean|any|unknown|void)\b/g, '$1');

  const compMatch = code.match(/function\s+([A-Z]\w*)\s*\(/);
  const componentName = compMatch ? compMatch[1] : null;

  // Transform JSX blocks into `h(...)` calls using a recursive descent over `<tag ...>...</tag>`
  const transformJsx = (input: string): string => {
    let i = 0;
    const len = input.length;

    const parseTextOrExpr = (): string => {
      let out = '';
      while (i < len) {
        if (input[i] === '<' && /[a-zA-Z/]/.test(input[i + 1] ?? '')) {
          break;
        }
        out += input[i];
        i++;
      }
      return out;
    };

    const findMatchingBrace = (start: number): number => {
      let depth = 1;
      let idx = start;
      let inStr: string | null = null;
      while (idx < len && depth > 0) {
        const ch = input[idx];
        if (inStr) {
          if (ch === '\\') {
            idx += 2;
            continue;
          }
          if (ch === inStr) inStr = null;
        } else {
          if (ch === '"' || ch === "'" || ch === '`') inStr = ch;
          else if (ch === '{') depth++;
          else if (ch === '}') depth--;
        }
        idx++;
      }
      return idx - 1;
    };

    const parseElement = (): string => {
      i++; // skip '<'
      let tag = '';
      while (i < len && /[a-zA-Z0-9_.-]/.test(input[i])) {
        tag += input[i++];
      }
      const propsParts: string[] = [];

      while (i < len) {
        while (i < len && /\s/.test(input[i])) i++;
        if (input.slice(i, i + 2) === '/>') {
          i += 2;
          const propsObj = propsParts.length > 0 ? `{${propsParts.join(',')}}` : 'null';
          const tagExpr = /^[A-Z]/.test(tag) ? tag : JSON.stringify(tag);
          return `h(${tagExpr},${propsObj})`;
        }
        if (input[i] === '>') {
          i++;
          break;
        }
        let attrName = '';
        while (i < len && /[a-zA-Z0-9_-]/.test(input[i])) {
          attrName += input[i++];
        }
        while (i < len && /\s/.test(input[i])) i++;
        if (input[i] === '=') {
          i++;
          while (i < len && /\s/.test(input[i])) i++;
          if (input[i] === '"' || input[i] === "'") {
            const q = input[i++];
            let val = '';
            while (i < len && input[i] !== q) val += input[i++];
            i++;
            propsParts.push(`${JSON.stringify(attrName)}:${JSON.stringify(val)}`);
          } else if (input[i] === '{') {
            const end = findMatchingBrace(i + 1);
            const expr = input.slice(i + 1, end);
            i = end + 1;
            propsParts.push(`${JSON.stringify(attrName)}:${transformChunk(expr)}`);
          }
        } else if (attrName) {
          propsParts.push(`${JSON.stringify(attrName)}:true`);
        } else {
          i++;
        }
      }

      const children: string[] = [];
      while (i < len) {
        if (input.slice(i, i + 2) === '</') {
          while (i < len && input[i] !== '>') i++;
          i++;
          break;
        }
        if (input[i] === '<' && /[a-zA-Z]/.test(input[i + 1] ?? '')) {
          children.push(parseElement());
          continue;
        }
        if (input[i] === '{') {
          const end = findMatchingBrace(i + 1);
          const expr = input.slice(i + 1, end).trim();
          i = end + 1;
          if (expr && !expr.startsWith('/*')) {
            children.push(transformChunk(expr));
          }
          continue;
        }
        let rawText = '';
        while (i < len && input[i] !== '<' && input[i] !== '{') {
          rawText += input[i++];
        }
        const collapsed = rawText.replace(/\s+/g, ' ');
        if (collapsed.trim()) {
          children.push(JSON.stringify(collapsed));
        }
      }

      const propsObj = propsParts.length > 0 ? `{${propsParts.join(',')}}` : 'null';
      const tagExpr = /^[A-Z]/.test(tag) ? tag : JSON.stringify(tag);
      const args = [tagExpr, propsObj, ...children].join(',');
      return `h(${args})`;
    };

    const transformChunk = (chunk: string): string => {
      let out = '';
      let idx = 0;
      const chunkLen = chunk.length;
      let inStr: string | null = null;
      while (idx < chunkLen) {
        const ch = chunk[idx];
        if (inStr) {
          out += ch;
          if (ch === '\\' && idx + 1 < chunkLen) {
            out += chunk[idx + 1];
            idx += 2;
            continue;
          }
          if (ch === inStr) inStr = null;
          idx++;
          continue;
        }
        if (ch === '"' || ch === "'" || ch === '`') {
          inStr = ch;
          out += ch;
          idx++;
          continue;
        }
        if (ch === '<' && /[a-zA-Z]/.test(chunk[idx + 1] ?? '')) {
          const prevChar = out.trimEnd().slice(-1);
          const prevWordMatch = out.trimEnd().match(/([a-zA-Z0-9_$]+)$/);
          const prevWord = prevWordMatch ? prevWordMatch[1] : '';
          const isJsxPosition =
            !prevChar ||
            ['(', '=', ':', ',', '[', '?', ';', '&', '|', '!'].includes(prevChar) ||
            prevWord === 'return';
          if (isJsxPosition) {
            const sub = transformJsx(chunk.slice(idx));
            // Use saved sub parser: instead run inner helper
            out += sub;
            return out;
          }
        }
        out += ch;
        idx++;
      }
      return out;
    };

    // Top-level scan
    let result = '';
    let inStr: string | null = null;
    while (i < len) {
      const ch = input[i];
      if (inStr) {
        result += ch;
        if (ch === '\\' && i + 1 < len) {
          result += input[i + 1];
          i += 2;
          continue;
        }
        if (ch === inStr) inStr = null;
        i++;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inStr = ch;
        result += ch;
        i++;
        continue;
      }
      if (ch === '<' && /[a-zA-Z]/.test(input[i + 1] ?? '')) {
        const prevTrim = result.trimEnd();
        const prevChar = prevTrim.slice(-1);
        const prevWordMatch = prevTrim.match(/([a-zA-Z0-9_$]+)$/);
        const prevWord = prevWordMatch ? prevWordMatch[1] : '';
        if (
          !prevChar ||
          ['(', '=', ':', ',', '[', '?', ';', '&', '|', '!'].includes(prevChar) ||
          prevWord === 'return'
        ) {
          result += parseElement();
          continue;
        }
      }
      result += ch;
      i++;
      void parseTextOrExpr;
    }
    return result;
  };

  return { js: transformJsx(code), componentName };
}

export function CodeSimulator({
  initialCode,
  language = 'html',
  starterBundle,
  defaultOpen = true,
  compact = false,
  externalRunNonce = 0,
  hideCollapse = false,
  titleLabel,
}: CodeSimulatorProps) {
  const { t } = useApp();
  const simId = useId();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [mode, setMode] = useState<SimulatorMode>('preview');
  const [code, setCode] = useState(initialCode);
  const [runNonce, setRunNonce] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const activeTokenRef = useRef(0);

  useEffect(() => {
    setCode(initialCode);
    setLogs([]);
    setRunNonce((n) => n + 1);
  }, [initialCode]);

  useEffect(() => {
    if (externalRunNonce > 0) {
      setIsOpen(true);
      setLogs([]);
      setRunNonce((n) => n + 1);
    }
  }, [externalRunNonce]);

  const currentToken = runNonce + externalRunNonce * 1000;
  activeTokenRef.current = currentToken;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.source === 'codepath-simulator' &&
        event.data.simId === simId &&
        event.data.token === activeTokenRef.current
      ) {
        setLogs((prev) => [...prev, String(event.data.message)]);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [simId]);

  const normalizedLang = language.toLowerCase();

  const browserTabTitle = useMemo(() => {
    if (normalizedLang === 'html') {
      return extractHtmlTitle(code) || t.lesson.untitledPage;
    }
    if (normalizedLang === 'css') return 'styles.css';
    if (normalizedLang === 'javascript' || normalizedLang === 'js') return 'app.js';
    if (normalizedLang === 'tsx' || normalizedLang === 'react') return 'App.tsx';
    if (normalizedLang === 'typescript' || normalizedLang === 'ts') return 'server.ts';
    return t.simulator.title;
  }, [code, normalizedLang, t.lesson.untitledPage, t.simulator.title]);

  const srcDoc = useMemo(() => {
    const bridge = `
      <script>
        (function() {
          var SIM_ID = ${JSON.stringify(simId)};
          var TOKEN = ${JSON.stringify(currentToken)};
          function send(prefix, args) {
            var text = Array.prototype.slice.call(args).map(function(a) {
              try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
              catch (e) { return String(a); }
            }).join(' ');
            window.parent.postMessage({ source: 'codepath-simulator', simId: SIM_ID, token: TOKEN, message: prefix + text }, '*');
          }
          var origLog = console.log;
          console.log = function() { send('', arguments); if (origLog) origLog.apply(console, arguments); };
          console.error = function() { send('[error] ', arguments); };
          window.onerror = function(msg) { send('[error] ', [msg]); };
        })();
      </script>
    `;

    // 1. HTML simulation
    if (normalizedLang === 'html') {
      const trimmed = code.trim();
      const isFullDoc = /<!doctype/i.test(trimmed) || /<html[\s>]/i.test(trimmed);
      const headInfo = parseHeadMetadata(code);
      const hasBody = hasVisibleBodyContent(code);
      const headCard = !hasBody ? renderMetadataPreviewHtml(headInfo, t.simulator.headInfoLabel) : '';

      if (isFullDoc) {
        let docHtml = code;
        const headInject = `${bridge}<style>${BASE_SIMULATOR_CSS}</style>`;
        docHtml = /<\/head>/i.test(docHtml)
          ? docHtml.replace(/<\/head>/i, `${headInject}</head>`)
          : `${headInject}${docHtml}`;

        if (!hasBody && headCard) {
          docHtml = /<\/body>/i.test(docHtml)
            ? docHtml.replace(/<\/body>/i, `${headCard}</body>`)
            : `${docHtml}${headCard}`;
        }

        return docHtml;
      }

      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    ${bridge}
    <style>${BASE_SIMULATOR_CSS}</style>
  </head>
  <body>
    ${hasBody ? code : headCard}
  </body>
</html>`;
    }

    // 2. CSS simulation
    if (normalizedLang === 'css') {
      let demoHtml = starterBundle?.html?.trim() || '';
      if (!demoHtml) {
        if (code.includes('.grid')) {
          demoHtml = `<div class="grid"><div>01</div><div>02</div><div>03</div></div>`;
        } else if (code.includes('.bar')) {
          demoHtml = `<header class="bar"><strong>CodePath</strong><nav>Docs</nav></header>`;
        } else {
          demoHtml = `<section class="preview-box"><h2>CSS Preview</h2><p>Edit CSS rules above to inspect live styling.</p></section>`;
        }
      }
      const gridCellHelper = code.includes('.grid')
        ? `.grid > div { border: 1px solid #d4d4d4; padding: 14px; background: #f5f5f5; font-family: ui-monospace, monospace; text-align: center; }`
        : '';

      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${BASE_SIMULATOR_CSS}\n${gridCellHelper}\n${code}</style>
  </head>
  <body>
    ${demoHtml}
    ${bridge}
  </body>
</html>`;
    }

    // 3. JavaScript simulation
    if (normalizedLang === 'javascript' || normalizedLang === 'js') {
      let demoHtml = starterBundle?.html?.trim() || '';
      if (!demoHtml) {
        const idMatch = code.match(/#([a-zA-Z0-9_-]+)|getElementById\(\s*['"]([a-zA-Z0-9_-]+)['"]\s*\)/);
        const foundId = idMatch ? idMatch[1] || idMatch[2] : null;
        if (foundId) {
          demoHtml = `<button id="${escapeHtml(foundId)}">Click me</button>`;
        } else {
          demoHtml = `<div id="sim-js-status" style="font-size:12px;color:#555555;">Script executed. See Console output below.</div>`;
        }
      }
      const demoCss = starterBundle?.css?.trim() || '';

      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${BASE_SIMULATOR_CSS}\n${demoCss}</style>
  </head>
  <body>
    ${demoHtml}
    ${bridge}
    <script>
      try {
        ${code}
      } catch (err) {
        console.error(err && err.message ? err.message : String(err));
      }
    </script>
  </body>
</html>`;
    }

    // 4. TSX / React simulation
    if (normalizedLang === 'tsx' || normalizedLang === 'react') {
      const compiled = compileSimpleTsxToJs(code);
      const targetComp = compiled.componentName || 'App';
      const defaultProps = /completed/.test(code) ? '{ completed: 4 }' : '{}';

      return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${BASE_SIMULATOR_CSS}</style>
  </head>
  <body>
    <div id="root"></div>
    ${bridge}
    <script>
      (function() {
        var states = [];
        var hookIdx = 0;
        var rootEl = document.getElementById('root');

        function useState(initial) {
          var idx = hookIdx++;
          if (states.length <= idx) {
            states[idx] = typeof initial === 'function' ? initial() : initial;
          }
          var setState = function(next) {
            states[idx] = typeof next === 'function' ? next(states[idx]) : next;
            console.log('State updated ->', states[idx]);
            mount();
          };
          return [states[idx], setState];
        }

        function h(type, props) {
          var children = Array.prototype.slice.call(arguments, 2);
          return { type: type, props: props || {}, children: children };
        }

        function createDom(vnode) {
          if (vnode === null || vnode === undefined || typeof vnode === 'boolean') {
            return document.createTextNode('');
          }
          if (typeof vnode === 'string' || typeof vnode === 'number') {
            return document.createTextNode(String(vnode));
          }
          if (Array.isArray(vnode)) {
            var frag = document.createDocumentFragment();
            vnode.forEach(function(item) { frag.appendChild(createDom(item)); });
            return frag;
          }
          if (typeof vnode.type === 'function') {
            return createDom(vnode.type(Object.assign({}, vnode.props, { children: vnode.children })));
          }
          var el = document.createElement(vnode.type);
          var props = vnode.props || {};
          Object.keys(props).forEach(function(key) {
            var val = props[key];
            if (key === 'className') {
              el.setAttribute('class', val);
            } else if (/^on[A-Z]/.test(key) && typeof val === 'function') {
              el.addEventListener(key.slice(2).toLowerCase(), val);
            } else if (key !== 'children') {
              el.setAttribute(key, val === true ? '' : String(val));
            }
          });
          (vnode.children || []).forEach(function(child) {
            el.appendChild(createDom(child));
          });
          return el;
        }

        try {
          ${compiled.js}
          function mount() {
            hookIdx = 0;
            rootEl.innerHTML = '';
            var Comp = typeof ${targetComp} !== 'undefined' ? ${targetComp} : null;
            if (typeof Comp === 'function') {
              var tree = Comp(${defaultProps});
              rootEl.appendChild(createDom(tree));
            }
          }
          mount();
        } catch (err) {
          console.error(err && err.message ? err.message : String(err));
        }
      })();
    </script>
  </body>
</html>`;
    }

    // 5. TypeScript / Backend route simulation
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>${BASE_SIMULATOR_CSS}</style>
  </head>
  <body>
    <div id="api-preview" style="border:1px solid #e7e7e7;border-radius:4px;background:#fafafa;overflow:hidden;">
      <div style="padding:8px 12px;border-bottom:1px solid #e7e7e7;background:#f5f5f5;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:11px;font-weight:600;color:#555555;">API Route Simulator</span>
        <button id="retest-btn" type="button" style="padding:3px 10px;font-size:11px;">Send Request</button>
      </div>
      <div id="api-result" style="padding:12px;font-family:ui-monospace,monospace;font-size:12px;"></div>
    </div>
    ${bridge}
    <script>
      (function() {
        var routes = [];
        var app = {
          get: function(path, handler) { routes.push({ method: 'GET', path: path, handler: handler }); },
          post: function(path, handler) { routes.push({ method: 'POST', path: path, handler: handler }); },
          put: function(path, handler) { routes.push({ method: 'PUT', path: path, handler: handler }); },
          delete: function(path, handler) { routes.push({ method: 'DELETE', path: path, handler: handler }); }
        };
        function invokeRoutes() {
          var out = document.getElementById('api-result');
          if (!routes.length) {
            out.textContent = 'Executed TypeScript snippet.';
            return;
          }
          var html = '';
          routes.forEach(function(r) {
            var resStatus = 200;
            var resBody = null;
            var res = {
              status: function(code) { resStatus = code; return res; },
              json: function(data) { resBody = data; return res; },
              send: function(data) { resBody = data; return res; }
            };
            r.handler({ method: r.method, path: r.path, body: {} }, res);
            console.log(r.method + ' ' + r.path + ' -> ' + resStatus, resBody);
            html += '<div style="margin-bottom:6px;"><strong>' + r.method + ' ' + r.path + '</strong> · Status ' + resStatus + '</div>' +
                    '<pre style="margin:0;">' + JSON.stringify(resBody, null, 2) + '</pre>';
          });
          out.innerHTML = html;
        }
        try {
          ${code}
          invokeRoutes();
          document.getElementById('retest-btn').onclick = invokeRoutes;
        } catch (err) {
          console.error(err && err.message ? err.message : String(err));
        }
      })();
    </script>
  </body>
</html>`;
  }, [code, currentToken, normalizedLang, simId, starterBundle, t.simulator.headInfoLabel]);

  const handleRun = () => {
    setLogs([]);
    setRunNonce((n) => n + 1);
  };

  const handleReset = () => {
    setCode(initialCode);
    setLogs([]);
    setRunNonce((n) => n + 1);
  };

  const showConsole =
    logs.length > 0 ||
    normalizedLang === 'javascript' ||
    normalizedLang === 'js' ||
    normalizedLang === 'tsx' ||
    normalizedLang === 'react' ||
    normalizedLang === 'typescript' ||
    normalizedLang === 'ts';

  const frameHeightClass = compact ? 'min-h-[150px]' : 'min-h-[210px]';

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!isOpen && !hideCollapse ? (
        <motion.div
          key="sim-collapsed"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16, ease: EASE_SETTLE }}
          className="flex items-center justify-between rounded border border-[#E7E7E7] bg-[#F5F5F5] px-3.5 py-2 dark:border-[#262626] dark:bg-[#191919]"
        >
          <div className="flex items-center gap-2 text-xs text-[#777777] dark:text-[#A3A3A3]">
            <Globe className="h-3.5 w-3.5 text-[#111111] dark:text-white" aria-hidden="true" />
            <span className="font-medium text-[#111111] dark:text-white">
              {titleLabel ?? t.simulator.title}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono uppercase">{normalizedLang}</span>
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOpen(true)}
            className="inline-flex h-8 items-center gap-1.5 rounded bg-[#111111] px-3 text-xs font-medium text-white whitespace-nowrap transition-colors hover:bg-[#2B2B2B] dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
          >
            <Play className="h-3 w-3" aria-hidden="true" />
            <span>{t.simulator.simulateBtn}</span>
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key="sim-expanded"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2, ease: EASE_SETTLE }}
          className="overflow-hidden rounded border border-[#E7E7E7] bg-white dark:border-[#262626] dark:bg-[#191919]"
        >
          {/* Simulator Chrome Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E7E7] bg-[#F5F5F5] px-3.5 py-2 dark:border-[#262626] dark:bg-[#141414]">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#111111] dark:text-white">
                <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{titleLabel ?? t.simulator.title}</span>
              </div>

              <span className="hidden text-[#CCCCCC] sm:inline dark:text-[#333333]" aria-hidden="true">
                |
              </span>

              <div
                className="hidden max-w-[200px] items-center gap-1.5 rounded border border-[#E7E7E7] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#555555] sm:flex dark:border-[#2A2A2A] dark:bg-[#111111] dark:text-[#D4D4D4]"
                dir="ltr"
              >
                <span className="truncate">{browserTabTitle}</span>
              </div>
            </div>

            {/* Mode Tabs & Actions */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'preview', label: t.simulator.previewTab, Icon: Globe, responsive: '' },
                  { id: 'edit', label: t.simulator.editCodeTab, Icon: Code2, responsive: '' },
                  { id: 'split', label: t.simulator.splitTab, Icon: Columns2, responsive: 'hidden md:inline-flex' },
                ] as const
              ).map(({ id, label, Icon, responsive }) => {
                const active = mode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMode(id)}
                    className={`relative inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors ${responsive} ${
                      active
                        ? 'text-white dark:text-[#111111]'
                        : 'text-[#555555] hover:bg-[#EAEAEA] hover:text-[#111111] dark:text-[#A3A3A3] dark:hover:bg-[#222222] dark:hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={`sim-mode-${simId}`}
                        transition={SPRING_SNAPPY}
                        className="absolute inset-0 rounded bg-[#111111] dark:bg-white"
                      />
                    )}
                    <Icon className="relative z-10 h-3 w-3" aria-hidden="true" />
                    <span className="relative z-10">{label}</span>
                  </button>
                );
              })}

              <span className="mx-0.5 text-[#CCCCCC] dark:text-[#333333]" aria-hidden="true">
                ·
              </span>

              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={handleRun}
                className="inline-flex items-center gap-1 rounded border border-[#111111] bg-[#111111] px-2.5 py-1 text-xs font-medium text-white whitespace-nowrap transition-colors hover:bg-[#2B2B2B] dark:border-white dark:bg-white dark:text-[#111111] dark:hover:bg-[#E7E7E7]"
              >
                <Play className="h-3 w-3" aria-hidden="true" />
                <span>{t.simulator.runBtn}</span>
              </motion.button>

              {code !== initialCode && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={handleReset}
                  className="inline-flex items-center gap-1 rounded border border-[#E7E7E7] bg-white px-2.5 py-1 text-xs font-medium text-[#111111] whitespace-nowrap hover:bg-[#EAEAEA] dark:border-[#333333] dark:bg-[#191919] dark:text-white dark:hover:bg-[#262626]"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>{t.simulator.resetBtn}</span>
                </motion.button>
              )}

              {!hideCollapse && (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  aria-label={t.simulator.hideBtn}
                  className="inline-flex items-center gap-1 rounded border border-[#E7E7E7] bg-white px-2 py-1 text-xs text-[#555555] hover:text-[#111111] dark:border-[#333333] dark:bg-[#191919] dark:text-[#A3A3A3] dark:hover:text-white"
                >
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Main Simulator Body */}
          <div
            className={`grid grid-cols-1 ${
              mode === 'split'
                ? 'md:grid-cols-2 md:divide-x md:divide-[#E7E7E7] md:dark:divide-[#262626]'
                : ''
            }`}
          >
            {(mode === 'edit' || mode === 'split') && (
              <div className="flex flex-col bg-[#111111]">
                <textarea
                  value={code}
                  onChange={(e) => {
                    setLogs([]);
                    setCode(e.target.value);
                  }}
                  spellCheck={false}
                  aria-label={`${t.simulator.editCodeTab} (${normalizedLang})`}
                  className={`code-ltr w-full flex-1 resize-y bg-[#111111] p-4 font-mono text-[12.5px] leading-6 text-[#F5F5F5] focus:outline-none ${frameHeightClass}`}
                />
              </div>
            )}

            {(mode === 'preview' || mode === 'split') && (
              <div className="flex flex-col bg-white">
                <iframe
                  key={`${simId}-${currentToken}`}
                  title={`${t.simulator.title} — ${browserTabTitle}`}
                  sandbox="allow-scripts"
                  srcDoc={srcDoc}
                  className={`w-full flex-1 border-0 bg-white ${frameHeightClass}`}
                />
              </div>
            )}
          </div>

          {/* Live Console Output Bar (when relevant or triggered) */}
          {showConsole && (
            <div className="border-t border-[#E7E7E7] bg-[#111111] dark:border-[#262626]">
              <div className="flex items-center justify-between border-b border-[#262626] bg-[#191919] px-3.5 py-1.5 text-[11px] text-[#A3A3A3]">
                <span className="inline-flex items-center gap-1.5 font-mono">
                  <Terminal className="h-3 w-3" aria-hidden="true" />
                  <span>{t.simulator.consoleTitle}</span>
                </span>
                {logs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setLogs([])}
                    className="inline-flex items-center gap-1 text-[11px] text-[#A3A3A3] hover:text-white"
                  >
                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                    <span>{t.simulator.clearConsole}</span>
                  </button>
                )}
              </div>
              <div className="code-ltr max-h-24 overflow-y-auto px-3.5 py-2 font-mono text-xs text-[#E7E7E7]">
                {logs.length === 0 ? (
                  <span className="text-[#777777]">—</span>
                ) : (
                  logs.map((line, i) => (
                    <motion.div
                      key={`${i}-${line}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.16, ease: EASE_SETTLE }}
                      className="border-b border-[#1E1E1E] py-0.5 last:border-b-0"
                    >
                      {line}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
