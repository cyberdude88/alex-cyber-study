#!/usr/bin/env python3
"""
Add SEO meta tags to all HTML pages in the alex-cyber-study site.
Run from the repo root: python3 scripts/add_seo.py
"""
import os, re
from pathlib import Path

BASE_URL = "https://cyberdude88.github.io/alex-cyber-study"
SITE_NAME = "Alex Cyber Study"
DEFAULT_DESC = "Free gamified CISSP study tools — drag-and-drop drills, practice exams, domain games, and precision reading trainer. 100% free, no login required."
DEFAULT_KEYWORDS = "CISSP study, CISSP free practice, CISSP exam prep, cybersecurity certification, ISC2, CISSP domains, free security study tool"
OG_IMAGE = f"{BASE_URL}/og-image.png"

# Page-specific descriptions and titles
PAGE_META = {
    "index.html": {
        "title": "Alex Cyber Study — Free CISSP Study Games & Drills",
        "desc": "Free gamified CISSP study tools. Drag-and-drop drills, CAT practice exam, domain games, and precision reading trainer across all 8 CISSP domains. No login, no cost.",
        "keywords": "CISSP study free, CISSP practice exam, CISSP drag drop, free cybersecurity study, ISC2 CISSP prep, CISSP domain games",
    },
    "domains.html": {
        "title": "CISSP Domains — Free Study Games | Alex Cyber Study",
        "desc": "Study all 8 CISSP domains with free interactive games. Security and Risk Management, Asset Security, Cryptography, Network Security, IAM, Assessment, SecOps, and SDLC.",
        "keywords": "CISSP domains, CISSP domain 1-8, CISSP security risk management, CISSP cryptography, CISSP network security, CISSP IAM",
    },
    "quiz/index.html": {
        "title": "CISSP Custom Quiz — Free Domain-Based Practice | Alex Cyber Study",
        "desc": "Build custom CISSP quiz sessions by domain, difficulty, and question type. Free, no login required.",
        "keywords": "CISSP quiz, CISSP practice questions, CISSP domain quiz free, cybersecurity quiz",
    },
    "practice-exam/index.html": {
        "title": "CISSP CAT Practice Exam — Free Simulation | Alex Cyber Study",
        "desc": "Free CISSP CAT (Computer Adaptive Testing) practice exam simulation. Questions adapt to your ability level across all 8 domains.",
        "keywords": "CISSP practice exam, CISSP CAT exam, CISSP simulation, free CISSP exam, adaptive CISSP test",
    },
    "drills/evidence-collection.html": {
        "title": "Order of Volatility Drill — CISSP Digital Forensics | Alex Cyber Study",
        "desc": "Drag-and-drop Order of Volatility drill for CISSP Domain 7. Practice ranking evidence sources from most to least volatile — RAM, swap, disk, archive.",
        "keywords": "CISSP order of volatility, digital forensics CISSP, evidence collection CISSP, CISSP domain 7 drill",
    },
    "drills/forensic-process.html": {
        "title": "Forensic Process Drill — NIST SP 800-86 | Alex Cyber Study",
        "desc": "Sort forensic activities into the correct NIST SP 800-86 phases. Free CISSP Domain 7 drill covering Collection, Examination, Analysis, and Reporting.",
        "keywords": "CISSP forensic process, NIST 800-86, CISSP domain 7, digital forensics phases, CISSP drill",
    },
    "drills/code-of-ethics/index.html": {
        "title": "ISC2 Code of Ethics Drill — CISSP | Alex Cyber Study",
        "desc": "Drag-and-drop drill for the ISC2 Code of Ethics. Fill in the exact wording of all 4 canons and arrange them in priority order. Know LEGALLY vs ethically cold.",
        "keywords": "ISC2 code of ethics, CISSP ethics, CISSP canon 2, CISSP legally ethically, ISC2 canons, CISSP ethics drill",
    },
    "drills/ediscovery/index.html": {
        "title": "E-Discovery EDRM Drill — CISSP | Alex Cyber Study",
        "desc": "Sequence the 9 EDRM phases in the correct order and answer CISSP-style FIRST/NEXT/BEFORE scenario questions on e-discovery. Free CISSP Domain 1 drill.",
        "keywords": "CISSP e-discovery, EDRM phases, electronic discovery CISSP, CISSP domain 1, legal hold CISSP, ESI CISSP",
    },
    "ciso-simulator/index.html": {
        "title": "CISO Simulator — Executive Decision Game | Alex Cyber Study",
        "desc": "Simulate executive CISO decisions. Balance stakeholders, security controls, budget, and regulatory risk in this free CISSP governance game.",
        "keywords": "CISO simulator, CISSP governance, CISSP executive decisions, security governance game, CISSP domain 1",
    },
    "frameworks/ciso-architecture-arena/index.html": {
        "title": "CISO Architecture Arena — SABSA, TOGAF, Zachman, ITIL | Alex Cyber Study",
        "desc": "Place security decisions in the correct framework layer and role. Practice SABSA, TOGAF, Zachman, and ITIL frameworks for the CISSP exam.",
        "keywords": "SABSA framework, TOGAF security, Zachman framework, ITIL CISSP, security architecture CISSP, enterprise architecture",
    },
    "frameworks/csa-star-levels/index.html": {
        "title": "CSA STAR Levels Drill — Cloud Security | Alex Cyber Study",
        "desc": "Read cloud assurance scenarios and identify the correct CSA STAR Level (1, 2, or 3). Free CISSP cloud security drill.",
        "keywords": "CSA STAR, cloud security CISSP, CISSP cloud, CSA STAR levels, cloud assurance",
    },
    "domain1/index.html": {
        "title": "CISSP Domain 1 — Security & Risk Management Games | Alex Cyber Study",
        "desc": "Free interactive study games for CISSP Domain 1: Security and Risk Management. Risk frameworks, governance, ethics, and legal concepts.",
        "keywords": "CISSP domain 1, security risk management CISSP, CISSP governance, CISSP risk, CISSP legal",
    },
    "domain2/index.html": {
        "title": "CISSP Domain 2 — Asset Security Games | Alex Cyber Study",
        "desc": "Free study games for CISSP Domain 2: Asset Security. Data classification, asset management, data protection controls.",
        "keywords": "CISSP domain 2, asset security CISSP, data classification CISSP, CISSP data protection",
    },
    "domain3/index.html": {
        "title": "CISSP Domain 3 — Security Architecture & Cryptography | Alex Cyber Study",
        "desc": "Free study games for CISSP Domain 3. Security models, cryptography attacks, memory types, TCSEC/EAL ratings, and security architecture.",
        "keywords": "CISSP domain 3, CISSP cryptography, CISSP security models, Bell-LaPadula, Biba, Clark-Wilson, CISSP encryption",
    },
    "domain4/index.html": {
        "title": "CISSP Domain 4 — Network Security Games | Alex Cyber Study",
        "desc": "Free study games for CISSP Domain 4: Communication and Network Security. IP protocols, network architecture, SASE, and network controls.",
        "keywords": "CISSP domain 4, CISSP network security, CISSP protocols, SASE CISSP, network architecture CISSP",
    },
    "domain5/index.html": {
        "title": "CISSP Domain 5 — IAM Games | Alex Cyber Study",
        "desc": "Free study games for CISSP Domain 5: Identity and Access Management. Kerberos, SESAME, IAM accounts, access review, and authentication.",
        "keywords": "CISSP domain 5, CISSP IAM, Kerberos CISSP, identity access management CISSP, CISSP authentication",
    },
    "domain6/index.html": {
        "title": "CISSP Domain 6 — Security Assessment & Testing | Alex Cyber Study",
        "desc": "Free study games for CISSP Domain 6: Security Assessment and Testing. SOC reports, assessment types, audit, and testing methodologies.",
        "keywords": "CISSP domain 6, CISSP security assessment, SOC reports CISSP, CISSP audit, CISSP testing",
    },
    "domain7/index.html": {
        "title": "CISSP Domain 7 — Security Operations | Alex Cyber Study",
        "desc": "Free study games for CISSP Domain 7: Security Operations. Incident response, digital forensics, SecOps concepts, and BCP/DRP.",
        "keywords": "CISSP domain 7, CISSP security operations, CISSP incident response, CISSP forensics, CISSP BCP DRP",
    },
    "domain8/index.html": {
        "title": "CISSP Domain 8 — Software Development Security | Alex Cyber Study",
        "desc": "Free study games for CISSP Domain 8: Software Development Security. SDLC phases, secure coding, and development security controls.",
        "keywords": "CISSP domain 8, CISSP SDLC, software security CISSP, secure development CISSP, CISSP secure coding",
    },
}

META_TEMPLATE = '''  <meta name="description" content="{desc}">
  <meta name="keywords" content="{keywords}">
  <meta name="author" content="Alex Cyber Study">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{canonical}">
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Alex Cyber Study">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:image" content="{og_image}">
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{desc}">
  <meta name="twitter:image" content="{og_image}">'''

def get_page_meta(rel_path):
    key = str(rel_path).replace("\\", "/")
    if key in PAGE_META:
        m = PAGE_META[key]
        return m["title"], m["desc"], m.get("keywords", DEFAULT_KEYWORDS)
    # Derive from title tag
    return None, DEFAULT_DESC, DEFAULT_KEYWORDS

def build_canonical(rel_path):
    parts = str(rel_path).replace("\\", "/")
    if parts.endswith("/index.html"):
        parts = parts[:-len("index.html")]
    elif parts == "index.html":
        parts = ""
    return f"{BASE_URL}/{parts}".rstrip("/")

def already_has_meta(content):
    return 'name="description"' in content or 'property="og:title"' in content

def inject_meta(html, title, desc, keywords, canonical):
    block = META_TEMPLATE.format(
        title=title, desc=desc, keywords=keywords,
        canonical=canonical, og_image=OG_IMAGE
    )
    # Insert after <meta name="viewport"> if present, else after <meta charset>
    for pattern in [
        r'(<meta name="viewport"[^>]*>)',
        r'(<meta charset[^>]*>)',
    ]:
        m = re.search(pattern, html, re.IGNORECASE)
        if m:
            insert_pos = m.end()
            return html[:insert_pos] + "\n" + block + html[insert_pos:]
    # Fallback: after <head>
    m = re.search(r'<head[^>]*>', html, re.IGNORECASE)
    if m:
        return html[:m.end()] + "\n" + block + html[m.end():]
    return html

def get_title_from_html(html):
    m = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
    return m.group(1).strip() if m else SITE_NAME

root = Path(__file__).parent.parent
updated = 0
skipped = 0

for html_file in sorted(root.rglob("*.html")):
    # Skip node_modules, .git, scripts themselves
    parts = html_file.parts
    if any(p in parts for p in ["node_modules", ".git", "scripts", "session"]):
        continue

    rel = html_file.relative_to(root)
    content = html_file.read_text(encoding="utf-8")

    if already_has_meta(content):
        print(f"  SKIP (already has meta): {rel}")
        skipped += 1
        continue

    page_title, desc, keywords = get_page_meta(rel)
    if not page_title:
        page_title = get_title_from_html(content)
        # Append site name if not already there
        if SITE_NAME not in page_title:
            page_title = f"{page_title} | {SITE_NAME}"

    canonical = build_canonical(rel)
    new_content = inject_meta(content, page_title, desc, keywords, canonical)
    html_file.write_text(new_content, encoding="utf-8")
    print(f"  DONE: {rel}")
    updated += 1

print(f"\nDone. {updated} pages updated, {skipped} skipped.")
