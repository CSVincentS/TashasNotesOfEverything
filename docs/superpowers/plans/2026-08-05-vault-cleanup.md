# Vault Cleanup & Consistency Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove dead files/stale references, fix broken template defaults and template↔note inconsistencies, restructure landmarks to the documented hierarchy, and update docs — landing in one commit.

**Architecture:** The vault is an Obsidian D&D note vault whose "source code" is Templater templates, Modal Forms / Meta Bind plugin JSON, and icon-folder config. All fixes are file edits (JSON pruning, template string changes, note tag reconciliation, file moves, doc updates). No runtime code is added. Each task is independently verifiable via `python3` JSON checks and `grep`/`git` assertions; there is no build/test/lint tooling.

**Tech Stack:** Markdown, YAML frontmatter, Templater (JS in `Assets/Templates/*.md`), plugin JSON configs, `git`. Verification uses `python3` (stdlib `json`, `glob`, `re`) and shell.

## Global Constraints

- **Obsidian must be closed** while editing `.obsidian/plugins/**/data.json` and `.obsidian/community-plugins.json` — Obsidian may overwrite these on exit. The operator closes Obsidian before Task 1.
- **All plugin JSON must remain valid** after every edit — verify with `python3 -m json.tool` or `json.load` before moving on.
- **Standard tag line format:** ` - <tag>` (dash-space-tag, no leading indent). Empty list renders as a lone ` -`. Applies to new/edited template output and tag blocks we edit in existing notes.
- **No prose/descriptive changes** — never edit summaries, `<span class="sub2">` header lines, quest text, or per-note custom icons.
- **Single final commit** per user preference (housekeeping decision). No per-task commits; `git` is used for `git diff`/`git status` verification only until Task 9.
- **Do not touch** `.obsidian/workspace.json`, `Assets/Images/header.png`, the `Assets/PDF`/`Assets/Videos` icon-folder entries, or session-note freeform tags.
- Names and conventions come verbatim from the spec: `docs/superpowers/specs/2026-08-05-vault-cleanup-design.md`.

---

### Task 1: Remove dead plugin references

**Files:**
- Modify: `.obsidian/community-plugins.json`
- Delete: `.obsidian/text-generator.json`
- Delete: `.obsidian/plugins/obsidian-style-settings/data (conflict 2021-12-13-10-21-38).json`
- Delete: `.obsidian/plugins/obsidian-style-settings/data.sync-conflict-20221001-160841-Q3BSAOD.json`

**Interfaces:**
- Consumes: existing community-plugins.json (valid JSON).
- Produces: a community-plugins list that exactly matches `.obsidian/plugins/` directory names.

- [ ] **Step 1: Remove `quickadd` from the enabled-plugins list**

Edit `.obsidian/community-plugins.json` so it becomes:

```json
[
  "obsidian-meta-bind-plugin",
  "templater-obsidian",
  "modalforms",
  "obsidian-style-settings",
  "folder-notes",
  "dataview",
  "obsidian-icon-folder"
]
```

- [ ] **Step 2: Delete stale config and conflict files**

Run:
```bash
rm ".obsidian/text-generator.json"
rm ".obsidian/plugins/obsidian-style-settings/data (conflict 2021-12-13-10-21-38).json"
rm ".obsidian/plugins/obsidian-style-settings/data.sync-conflict-20221001-160841-Q3BSAOD.json"
```

- [ ] **Step 3: Verify**

```bash
python3 -c "import json;print(json.load(open('.obsidian/community-plugins.json')))"
ls .obsidian/plugins | sort
```
Expected: JSON prints the 7 names above; the `ls` list is identical (7 folders: dataview, folder-notes, modalforms, obsidian-icon-folder, obsidian-meta-bind-plugin, obsidian-style-settings, templater-obsidian).

---

### Task 2: Delete the migration tool

**Files:**
- Delete: `Assets/Templates/MIGRATE.md`
- Modify: `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` — remove `migrate` and `migrate1` from `buttonTemplates`
- Modify: `.obsidian/plugins/modalforms/data.json` — remove the `VaultMigration` entry from `formDefinitions`

**Interfaces:**
- Consumes: the button/form JSON as-is.
- Produces: `buttonTemplates` ending on `pc` (no dangling comma), `formDefinitions` ending on `PC` (no dangling comma).

- [ ] **Step 1: Delete the template**

```bash
rm "Assets/Templates/MIGRATE.md"
```

- [ ] **Step 2: Remove the two buttons**

In `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`, delete the entire `migrate` object (label `"MIGRATE NOTES"`, id `"migrate"`, `templateFile: "Assets/Templates/MIGRATE.md"`) and the `migrate1` object (id `"migrate1"`, `templateFile: "Assets/Templates/MIGRATE 1.md"`). `buttonTemplates` must end with the `pc` object; the `pc` object's closing `}` must NOT be followed by a comma.

- [ ] **Step 3: Remove the VaultMigration form**

In `.obsidian/plugins/modalforms/data.json`, delete the object titled `"Note Migration Tool 🔧"` with `name: "VaultMigration"`. `formDefinitions` must end with the `PC` object (no trailing comma after its closing `}`).

- [ ] **Step 4: Verify**

```bash
python3 -m json.tool .obsidian/plugins/obsidian-meta-bind-plugin/data.json > /dev/null && echo OK
python3 -m json.tool .obsidian/plugins/modalforms/data.json > /dev/null && echo OK
grep -rn -i "MIGRATE\.md\|MIGRATE 1\|VaultMigration\|Note Migration Tool" --include="*.json" --include="*.md" . --exclude-dir=.git --exclude-dir=docs
```
Expected: both JSON files parse; grep returns nothing. (The icon-folder `"migrated"` settings key is a plugin-internal counter, not a tool reference; the docs/ folder intentionally documents the removal; the remaining AGENTS.md mention is removed in Task 8.)

---

### Task 3: Fix broken template defaults and bugs (NOTE.md, PLAYER.md)

**Files:**
- Modify: `Assets/Templates/NOTE.md` (line 25 banner default, line 37 icon name)
- Modify: `Assets/Templates/PLAYER.md` (line 17 portrait default, line 20 subclass gating)

**Interfaces:**
- Consumes: existing template logic (unchanged otherwise).
- Produces: correct default image paths and correct Lucide icon name; subclass no longer gated on class selection.

- [ ] **Step 1: NOTE.md — banner default**

`const banner = result.Banner.value || "session.jpg"` → `const banner = result.Banner.value || "session.png"`

- [ ] **Step 2: NOTE.md — icon name**

`const icon = "LiNoteBookPen"` → `const icon = "LiNotebookPen"`

- [ ] **Step 3: PLAYER.md — portrait default**

`const portrait = result.Portrait.value || "/Assets/Images/Portrait.jpg";` → `const portrait = result.Portrait.value || "portrait.jpg";`

- [ ] **Step 4: PLAYER.md — subclass gating bug**

`const subClass = result.pClass.value?.length ? result.subClass.value : [];` → `const subClass = result.subClass.value?.length ? result.subClass.value : [];`

- [ ] **Step 5: Verify**

```bash
grep -n "session.png\|LiNotebookPen" Assets/Templates/NOTE.md
grep -n "portrait.jpg\|subClass.value?\.length" Assets/Templates/PLAYER.md
```
Expected: `session.png` and `LiNotebookPen` appear in NOTE.md; `portrait.jpg` and `result.subClass.value?.length` appear in PLAYER.md; the old values (`session.jpg`, `LiNoteBookPen`, `/Assets/Images/Portrait.jpg`, `result.pClass.value?.length`) are gone.

---

### Task 4: Template consistency fixes

**Files:**
- Modify: `Assets/Templates/utils.js` — `getIcon` gains `Armor`/`Weapon`
- Modify: `Assets/Templates/REALM.md` — header icon matches applied icon
- Modify: `Assets/Templates/GOD.md` — emit `pantheon/*` tags; tag lines use ` - ` format
- Modify: `Assets/Templates/NOTE.md` — tag lines use ` - ` format

**Interfaces:**
- Consumes: `getIcon(type)` table, GOD/NOTE tag-building expressions.
- Produces: consistent icon naming and standardized ` - ` tag emission across templates.

- [ ] **Step 1: utils.js — add missing icon mappings**

In `getIcon`, add two entries (both icons already exist in the downloaded icon pack):
```js
            Armor: 'FasUserShield',
```
at the top of `iconMappings` (before `Blacksmith`), and
```js
            Weapon: 'FasHandFist',
```
as the last entry (after `Village`).

- [ ] **Step 2: REALM.md — header icon**

`<span class="sub2">:RiGlobalLine: Realm (world)</span>` → `<span class="sub2">:FasGlobe: Realm (world)</span>`

- [ ] **Step 3: GOD.md — pantheon tags + format**

Replace:
```js
const tags = domains ? domains.map(value => `- domain/${toCamelCase(value)}`).join("\n") : '-';
```
with:
```js
const tags = [
    ...(domains || []).map(value => ` - domain/${toCamelCase(value)}`),
    ...(result.Pantheon.value || []).map(value => ` - pantheon/${toCamelCase(value)}`)
].join("\n") || " -";
```

- [ ] **Step 4: NOTE.md — tag format**

Replace:
```js
    ? result.Tags.value.map(value => value.startsWith('#') ? `- ${value.slice(1)}` : `- ${toCamelCase(value)}`).join("\n")
```
with:
```js
    ? result.Tags.value.map(value => value.startsWith('#') ? ` - ${value.slice(1)}` : ` - ${toCamelCase(value)}`).join("\n")
```

- [ ] **Step 5: Verify**

```bash
grep -n "FasUserShield\|FasHandFist" Assets/Templates/utils.js
grep -n "FasGlobe" Assets/Templates/REALM.md
grep -n "pantheon/\${toCamelCase" Assets/Templates/GOD.md
grep -n " - \$" Assets/Templates/NOTE.md
```
Expected: `FasUserShield` and `FasHandFist` in utils.js; `FasGlobe` in REALM.md; `pantheon/${toCamelCase(value)}` in GOD.md; ` - ` interpolation in NOTE.md.

---

### Task 5: Fix existing note tags

**Files:**
- Modify: `Compendium/Party/Player Characters/Alaric Waycrest.md`
- Modify: `Compendium/Party/Player Characters/Kingston Yashkar.md`
- Modify: `Compendium/Party/Player Characters/Moira Belkas.md`
- Modify: `Compendium/Party/Player Characters/Tilda Rosesong.md`
- Modify: `Compendium/Lore/Objects/The Scarlet Scourge.md`
- Modify: `Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Sword Coast.md`

**Interfaces:**
- Consumes: existing frontmatter blocks (name/type unchanged).
- Produces: tag blocks matching template output conventions.

- [ ] **Step 1: Alaric Waycrest** — replace the tags block
```
tags:
  - race/halfOrc
  - class/fighter
  - class/rogue
```
with
```
tags:
 - race/halfOrc
 - class/fighter
 - class/rogue
 - subclass/battleMaster
 - subclass/swashbuckler
```

- [ ] **Step 2: Kingston Yashkar** — replace
```
tags:
- race/tabaxi
- class/paladin
```
with
```
tags:
 - race/tabaxi
 - class/paladin
 - subclass/conquest
```

- [ ] **Step 3: Moira Belkas** — replace
```
tags:
- race/human
- class/ranger
- class/druid
```
with
```
tags:
 - race/human
 - class/ranger
 - class/druid
 - subclass/swarmkeeper
 - subclass/stars
```

- [ ] **Step 4: Tilda Rosesong** — replace
```
tags:
- race/tiefling
- class/sorcerer
```
with
```
tags:
 - race/tiefling
 - class/sorcerer
 - subclass/divineSoul
```

- [ ] **Step 5: The Scarlet Scourge** — replace
```
tags:
- artifact
```
with
```
tags:
 - object/religiousArtifact
```

- [ ] **Step 6: Sword Coast** — replace
```
tags:
  - location/territory
```
with
```
tags:
 - location/province
```

- [ ] **Step 7: Verify**

```bash
grep -rn "subclass/" "Compendium/Party/Player Characters/"
grep -n "object/religiousArtifact" "Compendium/Lore/Objects/The Scarlet Scourge.md"
grep -n "location/province" "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Sword Coast.md"
```
Expected: each PC note shows its listed `subclass/*` tag; Scarlet Scourge shows `object/religiousArtifact` (and no flat `artifact` tag); Sword Coast shows `location/province`.

---

### Task 6: Restructure landmarks into `Name/Name.md` subfolders

**Files:**
- Move: `Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Baldurs Gate/Elfsong Tavern.md` → `.../Baldurs Gate/Elfsong Tavern/Elfsong Tavern.md`
- Move: `.../Baldurs Gate/Sorcerous Sundries.md` → `.../Baldurs Gate/Sorcerous Sundries/Sorcerous Sundries.md`
- Move: `.../Waterdeep/City of the Dead.md` → `.../Waterdeep/City of the Dead/City of the Dead.md`
- Modify: `.obsidian/plugins/obsidian-icon-folder/data.json`

**Interfaces:**
- Consumes: the three flat landmark notes (content unchanged) and their icon-folder keys.
- Produces: notes at `<parent>/<name>/<name>.md`; icon-folder keys point at the new note paths and the new folders.

- [ ] **Step 1: Move the files (git tracks the moves)**

```bash
mkdir "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Baldurs Gate/Elfsong Tavern"
mkdir "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Baldurs Gate/Sorcerous Sundries"
mkdir "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Waterdeep/City of the Dead"
git mv "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Baldurs Gate/Elfsong Tavern.md" "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Baldurs Gate/Elfsong Tavern/Elfsong Tavern.md"
git mv "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Baldurs Gate/Sorcerous Sundries.md" "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Baldurs Gate/Sorcerous Sundries/Sorcerous Sundries.md"
git mv "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Waterdeep/City of the Dead.md" "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Waterdeep/City of the Dead/City of the Dead.md"
```
Note: the notes' frontmatter is unchanged; wikilinks are name-based so they keep resolving.

- [ ] **Step 2: Update icon-folder keys**

In `.obsidian/plugins/obsidian-icon-folder/data.json`, replace the three note keys:
- `.../Baldurs Gate/Elfsong Tavern.md` → `.../Baldurs Gate/Elfsong Tavern/Elfsong Tavern.md` (value `LiBeer`)
- `.../Baldurs Gate/Sorcerous Sundries.md` → `.../Baldurs Gate/Sorcerous Sundries/Sorcerous Sundries.md` (value `RiShoppingCartFill`)
- `.../Waterdeep/City of the Dead.md` → `.../Waterdeep/City of the Dead/City of the Dead.md` (value `FasGhost`)

Add three folder keys with the same values:
- `.../Baldurs Gate/Elfsong Tavern` → `LiBeer`
- `.../Baldurs Gate/Sorcerous Sundries` → `RiShoppingCartFill`
- `.../Waterdeep/City of the Dead` → `FasGhost`

- [ ] **Step 3: Verify**

```bash
python3 -m json.tool .obsidian/plugins/obsidian-icon-folder/data.json > /dev/null && echo OK
find "Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast" -type f | sort
grep -n "Elfsong Tavern/Elfsong Tavern\|Sorcerous Sundries/Sorcerous Sundries\|City of the Dead/City of the Dead" .obsidian/plugins/obsidian-icon-folder/data.json
```
Expected: JSON parses; each landmark has exactly one `.md` file under its own subfolder; icon-folder JSON contains the new keys.

---

### Task 7: Prune stale icon-folder entries

**Files:**
- Modify: `.obsidian/plugins/obsidian-icon-folder/data.json`

**Interfaces:**
- Consumes: current icon-folder data (after Task 6).
- Produces: only keys whose paths exist on disk (plus the intentional `Assets/PDF`, `Assets/Videos` folder entries).

- [ ] **Step 1: Remove the 12 test-junk keys**

Delete these keys (they point at non-existent files/folders):
- `Compendium/Atlas/We in there` and `Compendium/Atlas/We in there/We in there.md`
- `Compendium/Atlas/what` and `Compendium/Atlas/what/what.md`
- `Compendium/Atlas/TEST REALM 2`
- `Compendium/Atlas//asdfadsf` and `Compendium/Atlas//asdfadsf/asdfadsf.md`
- `Compendium/Atlas//qweqweqwe` and `Compendium/Atlas//qweqweqwe/qweqweqwe.md`
- `Compendium/Lore/Objects/secret society.md`
- `Compendium/Lore/Objects/SS.md`
- `Compendium/Lore/Party/Quests/worked baby.md`

Keep `Assets/PDF` (`FasFilePdf`) and `Assets/Videos` (`FasVideo`).

- [ ] **Step 2: Verify — every remaining path exists**

```bash
python3 -c "import json,os;keep={'Assets/PDF','Assets/Videos'};d=json.load(open('.obsidian/plugins/obsidian-icon-folder/data.json'));missing=[k for k in d if k!='settings' and k not in keep and not os.path.exists(k)];print('MISSING:',missing) if missing else print('ALL EXIST')"
```
Expected: `ALL EXIST` (the two intentional `Assets/PDF`/`Assets/Videos` folder entries are exempt).

---

### Task 8: Housekeeping (docs + .gitignore)

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Create: `.gitignore`

**Interfaces:**
- Consumes: existing docs content.
- Produces: accurate, current documentation; workspace state excluded from git.

- [ ] **Step 1: AGENTS.md — fix stale statements**

In the intro paragraph, replace:
`Git repo is initialized but has no commits yet and no \`.gitignore\`.`
with:
`Git repo has an initial commit and a .gitignore that excludes Obsidian workspace state.`

Replace the gotcha bullet:
`The \`migrate1\` Meta Bind button references \`Assets/Templates/MIGRATE 1.md\`, which does not exist (stale). The working migration button is \`migrate\` → \`MIGRATE.md\`.`
with:
`The one-time migration utility (its template, the two Meta Bind buttons, and its confirmation form) was removed during the 2026-08-05 cleanup.`
(Note: do NOT spell out the removed template file name or button ids here — the final verification greps for those exact strings.)

Replace the `opencode.json` bullet:
`\`opencode.json\` references \`docs/superpowers/plans\` and \`docs/superpowers/specs\`, but the \`docs/\` folder does not exist yet — create it when writing plans/specs.`
with:
`\`docs/superpowers/plans\` and \`docs/superpowers/specs\` hold implementation plans and design specs respectively.`

- [ ] **Step 2: README.md — plugin list**

Under "Show Community Plugins", add the two missing required plugins:
- `- [x] Dataview`
- `- [x] Icon Folder`

- [ ] **Step 3: Create `.gitignore`**

```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
```

- [ ] **Step 4: Verify**

```bash
grep -n "initial commit\|removed during the 2026-08-05 cleanup\|docs/superpowers" AGENTS.md
grep -n "Dataview\|Icon Folder" README.md
cat .gitignore
```
Expected: each grep shows the new lines; `.gitignore` lists the three paths.

---

### Task 9: Full verification + single commit

**Files:**
- All files from Tasks 1–8.

**Interfaces:**
- Consumes: every change in this plan.
- Produces: verified clean vault state, one commit.

- [ ] **Step 1: Run the consolidated verification script**

```bash
python3 - <<'EOF'
import json, os, glob, re, sys
ok = True
def check(label, cond):
    global ok
    print(("PASS " if cond else "FAIL ") + label)
    if not cond: ok = False

# 1. All touched JSON parses
for p in [".obsidian/community-plugins.json",
          ".obsidian/plugins/obsidian-meta-bind-plugin/data.json",
          ".obsidian/plugins/modalforms/data.json",
          ".obsidian/plugins/obsidian-icon-folder/data.json"]:
    check(f"json parses: {p}", json.load(open(p)) is not None)

# 2. community-plugins exactly matches installed plugin folders
plugins = set(os.listdir(".obsidian/plugins"))
enabled = set(json.load(open(".obsidian/community-plugins.json")))
check("community-plugins matches installed plugins", plugins == enabled)

# 3. No stale references (vault-authored files only: *.md and *.json, excluding docs/ and .git/)
alltxt = ""
for root, _, files in os.walk("."):
    if ".git" in root or root.startswith("docs") or root.startswith("./docs"): continue
    for f in files:
        if not f.endswith((".md", ".json")): continue
        with open(os.path.join(root, f), encoding="utf-8", errors="replace") as fh:
            alltxt += fh.read() + "\n"
check("no MIGRATE references", not re.search(r"MIGRATE\.md|MIGRATE 1|VaultMigration|Note Migration Tool|\"id\": \"migrate\d?\"", alltxt, re.I))
check("no quickadd/text-generator refs", not re.search(r"quickadd|text.generator", alltxt, re.I))

# 4. Every icon-folder path exists
icd = json.load(open(".obsidian/plugins/obsidian-icon-folder/data.json"))
missing = [k for k in icd if k != "settings" and not os.path.exists(k)]
check("all icon-folder paths exist", not missing)

# 5. Wikilinks resolve by basename (content notes only)
md = [p for p in glob.glob("Compendium/**/*.md", recursive=True) + glob.glob("Session Notes/*.md")]
bases = {os.path.splitext(os.path.basename(p))[0] for p in md}
bad = []
for p in md:
    txt = re.sub(r"```base[\s\S]*?```", "", open(p, encoding="utf-8", errors="replace").read())
    for m in re.finditer(r"\[\[([^\]|#]+)", txt):
        t = m.group(1).strip()
        if not re.search(r'\.(png|jpe?g|webp|gif|svg|avif|bmp)$', t, re.I) and t not in bases:
            bad.append((p, t))
check("all wikilinks resolve", not bad)

# 6. Landmarks structured
for rel in ["Elfsong Tavern/Elfsong Tavern.md", "Sorcerous Sundries/Sorcerous Sundries.md", "City of the Dead/City of the Dead.md"]:
    hits = glob.glob(f"Compendium/Atlas/**/{rel}", recursive=True)
    check(f"landmark structured: {rel}", len(hits) == 1)

# 7. Corrected tags present
def has(path, frag):
    try: return frag in open(path, encoding="utf-8").read()
    except FileNotFoundError: return False
check("pc subclass tags", all(has(p, "subclass/") for p in glob.glob("Compendium/Party/Player Characters/*.md")))
check("scourge object tag", has("Compendium/Lore/Objects/The Scarlet Scourge.md", "object/religiousArtifact"))
check("sword coast province tag", has("Compendium/Atlas/Material Plane/Toril/Faerûn/Western Heartlands/Sword Coast/Sword Coast.md", "location/province"))

sys.exit(0 if ok else 1)
EOF
```
Expected: every line starts `PASS`, exit code 0.

- [ ] **Step 2: Review the diff**

```bash
git add -A
git status --short
git diff --cached --stat
```
Expected: the staged diff touches only files listed in Tasks 1–8, AGENTS.md (newly tracked), `.gitignore`, and the two new docs files `docs/superpowers/specs/2026-08-05-vault-cleanup-design.md` and `docs/superpowers/plans/2026-08-05-vault-cleanup.md`; no surprise files.

- [ ] **Step 3: Commit**

```bash
git commit -m "fix: clean up vault - remove dead tooling, fix template bugs, reconcile tags, restructure landmarks"
```
Expected: commit succeeds with a `git log --oneline -2` showing it on top of `47ea3af Initial Commit`.
