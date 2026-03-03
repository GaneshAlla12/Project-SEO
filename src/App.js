import { useState, useRef } from "react";

const SITE = "redcrowntechnologies.com";
const BUSINESS = "Red Crown Technologies";
const INDUSTRY = "B2B digital marketing & software agency";

const TOOLS = [
  {
    id: "audit",
    icon: "🛠️",
    label: "On-Page Audit",
    color: "#FF6B6B",
    description: "Analyze any page for SEO issues & fixes",
    placeholder: "Paste the page content or describe the page (e.g. homepage, services page, about us)...",
    systemPrompt: `You are a senior SEO specialist auditing pages for ${BUSINESS}, a ${INDUSTRY} at ${SITE}.

Analyze the provided page content and return a structured SEO audit in this EXACT format:

SCORE: [0-100]

CRITICAL_ISSUES:
- [issue]: [specific fix]

QUICK_WINS:
- [action]: [expected impact]

REWRITTEN_TITLE: [optimized title tag under 60 chars]
REWRITTEN_META: [optimized meta description under 160 chars]
REWRITTEN_H1: [optimized H1 with target keyword]

KEYWORD_TARGETS:
- [keyword] | [monthly volume estimate] | [difficulty: low/medium/high]

CONTENT_GAPS:
- [missing topic that competitors likely cover]

Be specific, actionable, and focused on B2B service agency SEO.`,
    userPrompt: (input) => `Audit this page content for SEO:\n\n${input}`
  },
  {
    id: "keywords",
    icon: "🔍",
    label: "Keyword Research",
    color: "#00C9A7",
    description: "Generate targeted keyword clusters for any service",
    placeholder: "Enter a service or topic (e.g. 'SEO services', 'custom software development', 'branding agency')...",
    systemPrompt: `You are a keyword research expert for ${BUSINESS}, a ${INDUSTRY}.
They serve USA and India markets. Target B2B decision-makers.

Return keyword research in this EXACT format:

PRIMARY_KEYWORD: [best keyword to target]
SEARCH_INTENT: [informational/commercial/transactional]

HIGH_PRIORITY_KEYWORDS:
- [keyword] | [est. volume] | [difficulty] | [intent]

LONG_TAIL_KEYWORDS:
- [keyword] | [est. volume] | [difficulty] | [intent]

LOCAL_KEYWORDS:
- [keyword targeting USA or India cities]

CONTENT_IDEAS:
- [blog post title targeting one of the above keywords]

COMPETITOR_ANGLES:
- [keyword a competitor likely ranks for that we should target]`,
    userPrompt: (input) => `Do keyword research for this topic/service: ${input}`
  },
  {
    id: "content",
    icon: "✍️",
    label: "Content Writer",
    color: "#6C63FF",
    description: "Generate full SEO blog posts & service page copy",
    placeholder: "Enter target keyword or topic (e.g. 'B2B digital marketing strategies 2025', 'how to choose a branding agency')...",
    systemPrompt: `You are an expert SEO content writer for ${BUSINESS}, a ${INDUSTRY}.
Write content that ranks on Google and converts B2B decision-makers.
Tone: Professional, authoritative, results-focused. Avoid fluff.

Write a complete SEO blog post in this format:

SEO_TITLE: [title under 60 chars with keyword]
META_DESCRIPTION: [under 160 chars]
SLUG: [url-friendly-slug]

ARTICLE:
[Full article with H2/H3 headings, 800-1000 words, natural keyword usage, internal link suggestions marked as [INTERNAL LINK: topic], and a strong CTA at the end pointing to redcrowntechnologies.com/contact.html]`,
    userPrompt: (input) => `Write an SEO blog post targeting this keyword: "${input}"\n\nThis is for ${BUSINESS}'s blog.`
  },
  {
    id: "competitor",
    icon: "🕵️",
    label: "Competitor Analysis",
    color: "#FFB347",
    description: "Analyze a competitor and find gaps to exploit",
    placeholder: "Enter competitor name or website (e.g. 'WebFX.com', 'Neil Patel Digital', 'local B2B agency name')...",
    systemPrompt: `You are a competitive SEO analyst working for ${BUSINESS}, a ${INDUSTRY} at ${SITE}.

Analyze the given competitor and return insights in this EXACT format:

COMPETITOR_STRENGTHS:
- [what they likely do well in SEO]

KEYWORD_GAPS:
- [keyword they rank for that ${BUSINESS} should target]

CONTENT_GAPS:
- [content type or topic they have that ${BUSINESS} is missing]

BACKLINK_OPPORTUNITIES:
- [type of site or publication to get backlinks from]

DIFFERENTIATION_ANGLES:
- [how ${BUSINESS} can position differently to outrank them]

QUICK_ATTACK_PLAN:
1. [first action to take this week]
2. [second action]
3. [third action]`,
    userPrompt: (input) => `Analyze this competitor for SEO gaps I can exploit for ${BUSINESS}: ${input}`
  },
  {
    id: "metafixer",
    icon: "🏷️",
    label: "Meta Tag Fixer",
    color: "#C084FC",
    description: "Bulk rewrite title tags & meta descriptions",
    placeholder: "Paste page names and current titles/meta one per line e.g:\nHomepage | B2B Digital Solutions & Marketing | Red Crown Technologies\nSEO Page | SEO Services - Red Crown\n...",
    systemPrompt: `You are an SEO specialist optimizing meta tags for ${BUSINESS}, a ${INDUSTRY}.
Target keywords should reflect B2B digital services. Location: USA & India.

For each page provided, return:

PAGE: [page name]
CURRENT_ISSUE: [what's wrong]
NEW_TITLE: [optimized, under 60 chars, includes keyword]
NEW_META: [optimized, under 160 chars, includes CTA]
TARGET_KEYWORD: [primary keyword for this page]

Separate each page with ---`,
    userPrompt: (input) => `Rewrite the meta tags for these pages:\n\n${input}`
  },
  {
    id: "linkbuilding",
    icon: "🔗",
    label: "Link Building",
    color: "#34D399",
    description: "Generate outreach emails & link building strategy",
    placeholder: "Describe what you want links for (e.g. 'our SEO service page', 'new blog post about B2B marketing tips')...",
    systemPrompt: `You are a link building expert for ${BUSINESS}, a ${INDUSTRY}.

Generate a link building plan in this format:

TARGET_ANCHOR_TEXTS:
- [anchor text variation]

OUTREACH_TARGETS:
- [type of website to approach] | [why they'd link to us]

GUEST_POST_TOPICS:
- [topic] | [target publication type]

OUTREACH_EMAIL:
Subject: [email subject line]
---
[Full personalized outreach email template, professional, value-first, not spammy, under 150 words]

DIRECTORY_SUBMISSIONS:
- [relevant B2B or tech directory to list on]`,
    userPrompt: (input) => `Create a link building plan for: ${input}\nWebsite: ${SITE}`
  }
];

function ResultBlock({ text, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {text.split('\n').filter(Boolean).map((line, i) => {
        const isHeader = /^[A-Z_]+:/.test(line) && !line.startsWith('-') && !line.startsWith(' ');
        const isBullet = line.trim().startsWith('-');
        const isNumbered = /^\d+\./.test(line.trim());
        const isSeparator = line.trim() === '---';

        if (isSeparator) return <hr key={i} style={{ border: "none", borderTop: "1px solid #222", margin: "12px 0" }} />;

        if (isHeader) {
          const colonIdx = line.indexOf(':');
          const key = line.slice(0, colonIdx);
          const val = line.slice(colonIdx + 1).trim();
          return (
            <div key={i} style={{ marginTop: "14px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", color: color, fontFamily: "monospace", marginBottom: "5px" }}>
                {key.replace(/_/g, ' ')}
              </div>
              {val && (
                <div style={{ fontSize: "13px", color: "#e8e0d0", padding: "8px 12px", background: `${color}12`, borderLeft: `2px solid ${color}`, borderRadius: "0 4px 4px 0", lineHeight: "1.6" }}>
                  {val}
                </div>
              )}
            </div>
          );
        }
        if (isBullet || isNumbered) {
          return (
            <div key={i} style={{ fontSize: "13px", color: "#ccc", padding: "5px 10px 5px 16px", borderLeft: "1px solid #2a2a2a", marginLeft: "4px", lineHeight: "1.6" }}>
              {line.trim()}
            </div>
          );
        }
        return <div key={i} style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.7", padding: "2px 0" }}>{line}</div>;
      })}
    </div>
  );
}

export default function App() {
  const [activeTool, setActiveTool] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const resultRef = useRef(null);
  const tool = TOOLS[activeTool];

  const run = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      // Calls our secure Vercel serverless function — API key never exposed to browser
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: tool.systemPrompt,
          userMessage: tool.userPrompt(input)
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
      setHistory(h => [{
        tool: tool.label, icon: tool.icon, color: tool.color,
        input: input.slice(0, 55), result: data.result,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...h.slice(0, 7)]);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#0a0a0a", minHeight: "100vh", color: "#e8e0d0", display: "flex", flexDirection: "column" }}>

      {/* Top Bar */}
      <div style={{ borderBottom: "1px solid #1a1a1a", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d0d", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setSidebarOpen(s => !s)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: "18px", padding: "0 4px" }}>☰</button>
          <div style={{ width: "30px", height: "30px", background: "#FF6B6B", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>🦅</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "600", letterSpacing: "-0.3px" }}>Red Crown SEO Automator</div>
            <div style={{ fontSize: "10px", color: "#444", fontFamily: "monospace" }}>redcrowntechnologies.com · Powered by Claude AI</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {history.length > 0 && (
            <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#555", padding: "3px 10px", border: "1px solid #1e1e1e", borderRadius: "20px" }}>
              {history.length} run{history.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{ width: "210px", flexShrink: 0, borderRight: "1px solid #1a1a1a", padding: "16px 10px", background: "#0d0d0d", overflowY: "auto" }}>
            <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#3a3a3a", fontFamily: "monospace", padding: "0 8px", marginBottom: "10px" }}>SEO TOOLS</div>
            {TOOLS.map((t, i) => (
              <button key={t.id} onClick={() => { setActiveTool(i); setResult(null); setInput(""); setError(null); }}
                style={{
                  width: "100%", background: activeTool === i ? `${t.color}15` : "transparent",
                  border: activeTool === i ? `1px solid ${t.color}40` : "1px solid transparent",
                  borderRadius: "6px", padding: "10px 10px", cursor: "pointer",
                  textAlign: "left", display: "flex", alignItems: "center", gap: "10px",
                  marginBottom: "3px", transition: "all 0.15s"
                }}>
                <span style={{ fontSize: "16px" }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize: "12px", color: activeTool === i ? t.color : "#777", fontFamily: "monospace", fontWeight: activeTool === i ? "700" : "400" }}>{t.label}</div>
                  <div style={{ fontSize: "10px", color: "#3a3a3a", marginTop: "1px", lineHeight: "1.3" }}>{t.description.split(' ').slice(0, 4).join(' ')}...</div>
                </div>
              </button>
            ))}

            {history.length > 0 && (
              <>
                <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#3a3a3a", fontFamily: "monospace", padding: "0 8px", marginTop: "20px", marginBottom: "10px" }}>RECENT RUNS</div>
                {history.map((h, i) => (
                  <div key={i} onClick={() => { setResult(h.result); setInput(h.input); }}
                    style={{ padding: "8px 10px", borderRadius: "5px", cursor: "pointer", marginBottom: "3px", border: "1px solid #1a1a1a", background: "#111" }}>
                    <div style={{ fontSize: "10px", color: h.color, fontFamily: "monospace" }}>{h.icon} {h.tool}</div>
                    <div style={{ fontSize: "10px", color: "#444", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.input}…</div>
                    <div style={{ fontSize: "9px", color: "#333", marginTop: "2px" }}>{h.time}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, padding: "32px", overflowY: "auto", maxWidth: "800px" }}>

          {/* Tool Header */}
          <div style={{ marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid #1a1a1a" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "48px", height: "48px", background: `${tool.color}18`, border: `1px solid ${tool.color}33`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                {tool.icon}
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "400", letterSpacing: "-0.5px" }}>{tool.label}</h1>
                <p style={{ margin: "3px 0 0", fontSize: "13px", color: "#555" }}>{tool.description}</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "10px", letterSpacing: "2px", color: "#555", fontFamily: "monospace", display: "block", marginBottom: "8px" }}>
              INPUT
            </label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={tool.placeholder}
              rows={5}
              style={{
                width: "100%", background: "#111", border: `1px solid #252525`,
                borderRadius: "8px", padding: "14px 16px", color: "#e8e0d0",
                fontSize: "13px", fontFamily: "Georgia, serif", resize: "vertical",
                outline: "none", boxSizing: "border-box", lineHeight: "1.7",
                transition: "border-color 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = tool.color}
              onBlur={e => e.target.style.borderColor = "#252525"}
              onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') run(); }}
            />
            <div style={{ fontSize: "10px", color: "#333", fontFamily: "monospace", marginTop: "5px" }}>
              Ctrl/⌘ + Enter to run
            </div>
          </div>

          {/* Run Button */}
          <button onClick={run} disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? "#161616" : tool.color,
              color: loading || !input.trim() ? "#444" : "#000",
              border: `1px solid ${loading || !input.trim() ? "#252525" : tool.color}`,
              borderRadius: "7px", padding: "13px 32px",
              fontSize: "12px", fontWeight: "700", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              fontFamily: "monospace", letterSpacing: "1.5px",
              transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: "8px"
            }}>
            {loading ? (
              <><span style={{ display: "inline-block", animation: "spin 0.8s linear infinite" }}>⟳</span> RUNNING AI…</>
            ) : `▶ RUN ${tool.label.toUpperCase()}`}
          </button>

          {/* Error */}
          {error && (
            <div style={{ marginTop: "16px", padding: "12px 16px", background: "#FF6B6B0f", border: "1px solid #FF6B6B33", borderRadius: "6px", fontSize: "13px", color: "#FF6B6B", fontFamily: "monospace" }}>
              ⚠ {error}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div style={{ marginTop: "28px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#333", fontFamily: "monospace", marginBottom: "14px" }}>AI IS THINKING…</div>
              {[75, 55, 85, 45, 65, 80, 50].map((w, i) => (
                <div key={i} style={{ height: "11px", background: "#161616", borderRadius: "4px", width: `${w}%`, marginBottom: "10px", animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div ref={resultRef} style={{ marginTop: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", color: tool.color, fontFamily: "monospace", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#34D399" }}>✓</span> RESULT — {tool.label.toUpperCase()}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => navigator.clipboard.writeText(result)}
                    style={{ background: "transparent", border: "1px solid #252525", color: "#555", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "10px", fontFamily: "monospace", transition: "all 0.15s" }}
                    onMouseEnter={e => e.target.style.borderColor = "#444"}
                    onMouseLeave={e => e.target.style.borderColor = "#252525"}>
                    COPY
                  </button>
                  <button onClick={() => setResult(null)}
                    style={{ background: "transparent", border: "1px solid #252525", color: "#555", padding: "5px 12px", borderRadius: "4px", cursor: "pointer", fontSize: "10px", fontFamily: "monospace" }}>
                    CLEAR
                  </button>
                </div>
              </div>
              <div style={{ background: "#0e0e0e", border: `1px solid ${tool.color}20`, borderRadius: "10px", padding: "24px", borderLeft: `3px solid ${tool.color}` }}>
                <ResultBlock text={result} color={tool.color} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.5; } }
        * { box-sizing: border-box; }
        textarea::placeholder { color: #333; font-style: italic; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 2px; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}
