# 🦅 Red Crown SEO Automator

AI-powered SEO tool for Red Crown Technologies — built with React + Vercel serverless backend.

---

## 🚀 Deploy in 5 Steps (Free)

### Step 1 — Get your Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up / log in
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`)

---

### Step 2 — Upload to GitHub
1. Go to https://github.com → click **New repository**
2. Name it `redcrown-seo-automator` → click **Create**
3. Upload ALL these project files (drag & drop or use GitHub Desktop)

---

### Step 3 — Connect to Vercel
1. Go to https://vercel.com → Sign up free with GitHub
2. Click **Add New Project**
3. Select your `redcrown-seo-automator` repo
4. Vercel auto-detects React → click **Deploy**

---

### Step 4 — Add your API Key (IMPORTANT)
1. In Vercel dashboard → go to your project → **Settings**
2. Click **Environment Variables**
3. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-your-key-here`
4. Click **Save**
5. Go to **Deployments** → click **Redeploy** (to apply the env var)

---

### Step 5 — Share the link!
Vercel gives you a live URL like:
`https://redcrown-seo-automator.vercel.app`

Share this with your friend — it works on any device, no install needed! 🎉

---

## 🔧 Tools Included

| Tool | What it does |
|------|-------------|
| 🛠️ On-Page Audit | Analyzes any page content for SEO issues |
| 🔍 Keyword Research | Generates keyword clusters for any service |
| ✍️ Content Writer | Writes full SEO blog posts ready to publish |
| 🕵️ Competitor Analysis | Finds gaps to exploit vs competitors |
| 🏷️ Meta Tag Fixer | Bulk rewrites title tags & meta descriptions |
| 🔗 Link Building | Generates outreach emails & strategy |

---

## 💰 Cost Estimate
- Vercel hosting: **Free** (hobby plan)
- Anthropic API: ~$0.01–0.05 per run (very cheap)
- GitHub: **Free**

---

## 🔒 Security
Your API key is stored as a Vercel environment variable — never exposed in the browser. All API calls go through the secure `/api/chat` serverless function.
