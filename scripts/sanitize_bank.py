#!/usr/bin/env python3
"""
Sanitize the CISSP question bank:
  1. Remove exact duplicate stems (keep lowest-numbered ID)
  2. Replace proper names / company names with generic equivalents
  3. Report near-duplicates (similar stems) for human review
  4. Write cleaned bank to question-bank.sanitized.json

Run from repo root:
  python3 scripts/sanitize_bank.py
"""
import json, re, copy
from collections import defaultdict
from pathlib import Path

BANK_IN  = Path(__file__).parent.parent / "cat" / "question-bank.sample.json"
BANK_OUT = Path(__file__).parent.parent / "cat" / "question-bank.sanitized.json"

# ── Replacements ────────────────────────────────────────────────────────────────
# Each tuple: (regex_pattern, replacement, flags, description)
REPLACEMENTS = [
    # Company names
    (r'\bABC Corp\b',           'the organization',        re.IGNORECASE, 'ABC Corp → the organization'),
    (r'\bABC\s+Corporation\b',  'the organization',        re.IGNORECASE, 'ABC Corporation → the organization'),
    (r'\bACME\b',               'the company',             re.IGNORECASE, 'ACME → the company'),
    (r'\bMegaCorp\b',           'the organization',        re.IGNORECASE, 'MegaCorp → the organization'),
    (r'\bInitech\b',            'the company',             re.IGNORECASE, 'Initech → the company'),
    (r'\bGlobex\b',             'the company',             re.IGNORECASE, 'Globex → the company'),
    (r'\bTechCorp\b',           'the organization',        re.IGNORECASE, 'TechCorp → the organization'),
    (r'\bXYZ Corp\b',           'the organization',        re.IGNORECASE, 'XYZ Corp → the organization'),
    # Named individuals (preserve Alice/Bob — standard crypto academic notation)
    (r'\bJason\b(?!\s+Web\s+Token)',  'The CISO',          0,             'Jason → The CISO'),
    (r'\bHideo\b',              'The analyst',             0,             'Hideo → The analyst'),
    (r'\bDion\b',               'the instructor',          0,             'Dion → the instructor'),
    # Fix grammar artifacts from replacements
    (r'\bThe CISO as a CISO\b', 'The CISO',               0,             'Fix double-CISO artifact'),
    (r'\bThe CISO as a CISO\b', 'The CISO',               re.IGNORECASE, 'Fix double-CISO artifact (ci)'),
]

def apply_replacements(text: str) -> tuple[str, list[str]]:
    """Apply all replacements, return (new_text, list_of_changes)."""
    changes = []
    for pat, repl, flags, desc in REPLACEMENTS:
        new_text = re.sub(pat, repl, text, flags=flags)
        if new_text != text:
            changes.append(desc)
            text = new_text
    return text, changes

def sanitize_item(item: dict) -> tuple[dict, list[str]]:
    """Sanitize a single question item in-place copy."""
    item = copy.deepcopy(item)
    all_changes = []

    item['stem'], ch = apply_replacements(item['stem'])
    all_changes.extend(ch)

    new_choices = []
    for choice in item['choices']:
        new_choice, ch = apply_replacements(choice)
        all_changes.extend(ch)
        new_choices.append(new_choice)
    item['choices'] = new_choices

    if 'explanation' in item:
        item['explanation'], ch = apply_replacements(item['explanation'])
        all_changes.extend(ch)

    return item, all_changes

# ── Load ────────────────────────────────────────────────────────────────────────
with open(BANK_IN, encoding='utf-8') as f:
    bank = json.load(f)

original_count = len(bank['items'])
print(f"Loaded {original_count} items from {BANK_IN.name}")

# ── Step 1: Remove exact duplicate stems ────────────────────────────────────────
print("\n── Step 1: Exact duplicate removal ──")

# Group base questions by normalized stem
def normalize(text):
    return re.sub(r'\s+', ' ', text.lower().strip())

stem_map = defaultdict(list)  # normalized_stem → [item, ...]
for item in bank['items']:
    if '__v' not in item['id']:
        stem_map[normalize(item['stem'])].append(item)

dupes_found = 0
ids_to_remove = set()

for norm_stem, group in stem_map.items():
    if len(group) > 1:
        # Sort by ID, keep first (lowest-numbered is original)
        group.sort(key=lambda x: x['id'])
        keep = group[0]
        remove = group[1:]
        dupes_found += 1
        print(f"  DUPE: keeping [{keep['id']}], removing {[r['id'] for r in remove]}")
        print(f"        Stem: \"{norm_stem[:80]}...\"")
        for r in remove:
            ids_to_remove.add(r['id'])
            # Also remove their variants
            ids_to_remove.add(r['id'] + '__v1')
            ids_to_remove.add(r['id'] + '__v2')

bank['items'] = [i for i in bank['items'] if i['id'] not in ids_to_remove]
after_dedup = len(bank['items'])
print(f"\n  Removed {original_count - after_dedup} items ({dupes_found} duplicate base questions + their variants)")

# ── Step 2: Apply name/company sanitization ─────────────────────────────────────
print("\n── Step 2: Name / company sanitization ──")

sanitized_items = []
total_changes = 0
changed_ids = []

for item in bank['items']:
    new_item, changes = sanitize_item(item)
    sanitized_items.append(new_item)
    if changes:
        total_changes += len(changes)
        changed_ids.append((item['id'], changes))

bank['items'] = sanitized_items
print(f"  {len(changed_ids)} items modified, {total_changes} total substitutions")
for id_, changes in changed_ids[:10]:
    print(f"    [{id_}] {', '.join(set(changes))}")
if len(changed_ids) > 10:
    print(f"    ... and {len(changed_ids) - 10} more")

# ── Step 3: Near-duplicate report ───────────────────────────────────────────────
print("\n── Step 3: Near-duplicate report (informational, not removed) ──")

base_items_final = [i for i in bank['items'] if '__v' not in i['id']]
prefix_map = defaultdict(list)
for item in base_items_final:
    key = normalize(item['stem'])[:70]
    prefix_map[key].append(item['id'])

near_dupes = {k: v for k, v in prefix_map.items() if len(v) > 1}
print(f"  Near-duplicate pairs (same first 70 chars): {len(near_dupes)}")
print("  These are slightly reworded variants — review manually if desired.")
for k, ids in list(near_dupes.items())[:5]:
    print(f"    {ids} → \"{k}\"")

# ── Step 4: Unique ID check ─────────────────────────────────────────────────────
print("\n── Step 4: Unique ID check ──")
all_ids = [i['id'] for i in bank['items']]
dup_ids = [id_ for id_, cnt in defaultdict(int, {}).items() if cnt > 1]
id_counts = defaultdict(int)
for id_ in all_ids:
    id_counts[id_] += 1
dup_ids = [id_ for id_, cnt in id_counts.items() if cnt > 1]
print(f"  Duplicate IDs: {len(dup_ids)}")
if dup_ids:
    for d in dup_ids[:5]:
        print(f"    {d}")

# ── Save ────────────────────────────────────────────────────────────────────────
bank['sanitization_info'] = {
    'original_count': original_count,
    'final_count': len(bank['items']),
    'exact_dupes_removed': original_count - after_dedup,
    'items_name_sanitized': len(changed_ids),
    'near_dupe_pairs': len(near_dupes),
}

with open(BANK_OUT, 'w', encoding='utf-8') as f:
    json.dump(bank, f, indent=2, ensure_ascii=False)

print(f"\n── Summary ──")
print(f"  Original:  {original_count} items")
print(f"  Final:     {len(bank['items'])} items")
print(f"  Removed:   {original_count - len(bank['items'])} items (dupes)")
print(f"  Sanitized: {len(changed_ids)} items (names/companies)")
print(f"\n  Saved to: {BANK_OUT}")
