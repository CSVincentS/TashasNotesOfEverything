# Clean-Start Tasha's Vault Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a fresh, empty Obsidian vault at `clean-vault/` with the same automation chain (buttons → forms → templates → utils.js), the 12 CSS snippets, and dashboard/docs as this vault, plus a written `CLEAN-VAULT-SETUP.md` guide that walks the user through installing and configuring the 7 plugins, Prism theme, and snippets themselves.

**Architecture:** Static files that cannot be authored in a GUI (templates, `utils.js`, snippets, `INDEX.md`, skeleton, docs) are copied verbatim from the current vault into `clean-vault/`. Everything plugin-related is intentionally left out of the scaffold; a guide at the repo root gives exact GUI settings (extracted from the current plugins' `data.json`) plus an exact-match JSON-copy fallback. `clean-vault/` is gitignored in this repo; the guide and plan/spec docs are the committed artifacts.

**Tech Stack:** Obsidian; community plugins Templater, Meta Bind, Modal Forms, Style Settings, Folder Notes, Dataview, Icon Folder; Prism theme; Obsidian Bases (core). No build/test/lint tooling — verification is manual file inspection and shell diffs.

## Global Constraints

- All copied files must be **verbatim** copies of the current vault (no content edits, no reformatting).
- The new vault must be **empty of content**: no sample NPCs, sessions, lore, images.
- Do **not** create `.obsidian/plugins/`, `.obsidian/themes/`, or `.obsidian/icons/` in `clean-vault/` — the user installs/creates these themselves.
- Folder names, file names, button IDs, form names, and template names must match the current vault **exactly**, including `Compendium/NPC's` (apostrophe) and template form names (e.g. `PLAYER.md` opens form `PC`).
- Frontmatter `type` values, camelCase tags, and Atlas subfolder pattern are defined by the templates — do not alter them.
- The guide's primary instructions are **GUI settings**; raw `data.json` copy commands are an appendix fallback, never the primary path.
- `clean-vault/` must be added to the repo root `.gitignore` so it is never committed here.
- Commit only repo-root tracked artifacts (`.gitignore`, `CLEAN-VAULT-SETUP.md`, plan, spec). Files under `clean-vault/` are gitignored and never committed.

---

### Task 1: Scaffold the clean-vault folder skeleton

**Files:**
- Create: `clean-vault/` directory tree (empty folders)

**Interfaces:**
- Produces: the folder tree every later task and every button/form/template target refers to. All paths are relative to the repo root.

- [ ] **Step 1: Create the directory tree**

```bash
mkdir -p \
  clean-vault/Session\ Notes \
  "clean-vault/Compendium/NPC's" \
  clean-vault/Compendium/Party/Player\ Characters \
  clean-vault/Compendium/Party/Quests \
  clean-vault/Compendium/Lore/Deities \
  clean-vault/Compendium/Lore/Events \
  clean-vault/Compendium/Lore/Objects \
  clean-vault/Compendium/Lore/Organizations \
  clean-vault/Compendium/Atlas \
  clean-vault/Assets/Templates \
  clean-vault/Assets/Images \
  clean-vault/.obsidian/snippets
```

- [ ] **Step 2: Verify the tree**

Run: `find clean-vault -type d | sort`
Expected: exactly the 13 directories above, nothing else. Confirm there is **no** `.obsidian/plugins`, `.obsidian/themes`, or `.obsidian/icons`.

- [ ] **Step 3: No commit needed** (contents are gitignored in Task 5; the empty tree is not tracked).

---

### Task 2: Copy templates + utils.js

**Files:**
- Create: `clean-vault/Assets/Templates/*.md`, `clean-vault/Assets/Templates/utils.js`
- Source: `Assets/Templates/` (current vault)

**Interfaces:**
- Produces: the 16 templates each referenced by a Meta Bind button (`Assets/Templates/<NAME>.md`) and by `utils.js`. The `STARTUP.md` is also the Templater startup template the guide configures. Copy verbatim — do not edit.

- [ ] **Step 1: Copy the files**

```bash
cp Assets/Templates/CONTINENT.md Assets/Templates/EVENT.md Assets/Templates/GOD.md \
   Assets/Templates/LANDMARK.md Assets/Templates/LOCALE.md Assets/Templates/NOTE.md \
   Assets/Templates/NPC.md Assets/Templates/OBJECT.md Assets/Templates/ORGANIZATION.md \
   Assets/Templates/PLANE.md Assets/Templates/PLAYER.md Assets/Templates/PROVINCE.md \
   Assets/Templates/QUEST.md Assets/Templates/REALM.md Assets/Templates/STARTUP.md \
   Assets/Templates/TERRITORY.md Assets/Templates/utils.js \
   "clean-vault/Assets/Templates/"
```

- [ ] **Step 2: Verify byte-for-byte identical**

Run: `diff -r Assets/Templates clean-vault/Assets/Templates && echo IDENTICAL`
Expected: `IDENTICAL` and no diff output. Then run `ls clean-vault/Assets/Templates | wc -l`, expected `17`.

- [ ] **Step 3: Confirm the template→form contract for the guide**

Run:
```bash
rg -o "MF.openForm\('[A-Z]+'\)" clean-vault/Assets/Templates | sort
```
Expected (this exact map is reused in Task 7's form table):
```
.../CONTINENT.md:5: MF.openForm('CONTINENT')
.../EVENT.md:5: MF.openForm('EVENT')
.../GOD.md:5: MF.openForm('GOD')
.../LANDMARK.md:5: MF.openForm('LANDMARK')
.../LOCALE.md:5: MF.openForm('LOCALE')
.../NOTE.md:5: MF.openForm('NOTE')
.../NPC.md:5: MF.openForm('NPC')
.../OBJECT.md:5: MF.openForm('OBJECT')
.../ORGANIZATION.md:5: MF.openForm('ORGANIZATION')
.../PLAYER.md:5: MF.openForm('PC')
.../PLANE.md:5: MF.openForm('PLANE')
.../PROVINCE.md:5: MF.openForm('PROVINCE')
.../QUEST.md:5: MF.openForm('QUEST')
.../REALM.md:5: MF.openForm('REALM')
.../TERRITORY.md:5: MF.openForm('TERRITORY')
```
Note: `PLAYER.md` opens form `PC` — the guide must reflect this.

- [ ] **Step 4: No commit needed** (gitignored).

---

### Task 3: Copy the 12 CSS snippets

**Files:**
- Create: `clean-vault/.obsidian/snippets/*.css` (12 files)
- Source: `.obsidian/snippets/` (current vault)

**Interfaces:**
- Produces: the snippet files the user enables in *Appearance → CSS snippets* (guide Task 6).

- [ ] **Step 1: Copy the files**

```bash
cp .obsidian/snippets/*.css "clean-vault/.obsidian/snippets/"
```

- [ ] **Step 2: Verify byte-for-byte identical + count**

Run: `diff -r .obsidian/snippets clean-vault/.obsidian/snippets && echo IDENTICAL`
Expected: `IDENTICAL`, then `ls "clean-vault/.obsidian/snippets" | wc -l` → `12`.

- [ ] **Step 3: No commit needed** (gitignored).

---

### Task 4: Copy dashboard + docs, create vault .gitignore

**Files:**
- Create: `clean-vault/INDEX.md`, `clean-vault/AGENTS.md`, `clean-vault/README.md`, `clean-vault/.gitignore`
- Source: `INDEX.md`, `AGENTS.md`, `README.md` (current vault)

**Interfaces:**
- Produces: the dashboard (`INDEX.md`, with its five `BUTTON[...]` rows that reference the button ids), the AI-tooling doc (`AGENTS.md`), the user-facing readme, and the vault's own `.gitignore`.

- [ ] **Step 1: Copy the three docs**

```bash
cp INDEX.md AGENTS.md README.md clean-vault/
```

- [ ] **Step 2: Verify byte-for-byte identical**

Run: `diff INDEX.md clean-vault/INDEX.md && diff AGENTS.md clean-vault/AGENTS.md && diff README.md clean-vault/README.md && echo IDENTICAL`
Expected: `IDENTICAL`, no diff output.

- [ ] **Step 3: Write the vault's .gitignore**

Write `clean-vault/.gitignore` (Obsidian workspace state only — same entries as this repo's, since the vault will get its own git history when the user moves it out):

```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
```

- [ ] **Step 4: Verify the button ids in INDEX.md match the button table (Task 7)**

Run:
```bash
rg -o "BUTTON\[[a-z, ]+\]" clean-vault/INDEX.md
```
Expected:
```
BUTTON[npc]
BUTTON[pc] BUTTON[quest]
BUTTON[plane, realm, continent, territory, province, locale, landmark]
BUTTON[deity, event, object, org]
BUTTON[note]
```
Union of ids: `npc, pc, quest, plane, realm, continent, territory, province, locale, landmark, deity, event, object, org, note` = 15 (matches the 15 Meta Bind buttons in Task 7).

- [ ] **Step 5: No commit needed** (gitignored).

---

### Task 5: Gitignore the scaffold in the parent repo

**Files:**
- Modify: `.gitignore` (repo root)

**Interfaces:**
- Produces: isolation so `clean-vault/` stays untracked in this repo until the user moves it out.

- [ ] **Step 1: Add `clean-vault/` to the repo .gitignore**

Append a line to `.gitignore` so it reads:

```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
clean-vault/
```

- [ ] **Step 2: Verify the ignore rule works**

Run: `git check-ignore clean-vault && git status --porcelain`
Expected: `git check-ignore` prints `clean-vault`; `git status` shows only the `.gitignore` modification (plus any pre-existing changes) and never any `clean-vault/` entries.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore clean-vault scaffold"
```

---

### Task 6: Write guide — Part 1: overview, open vault, theme, snippets, plugin install index, Templater, Dataview

**Files:**
- Create: `CLEAN-VAULT-SETUP.md` (repo root)

**Interfaces:**
- Produces: the user-facing handoff document. It is the primary deliverable and is committed. Later tasks append sections to this same file. The guide is written so it stays valid after the vault is moved out of this repo (reference the original vault's `data.json` paths as `<this-repo-root>/.obsidian/plugins/...`).

- [ ] **Step 1: Write the document header + "Before you start"**

Write to `CLEAN-VAULT-SETUP.md`:

````markdown
# Clean-Start Vault Setup Guide

This guide sets up a fresh Obsidian vault with the same automation as Tasha's Notes of
Everything. You do all of the plugin installation and configuration yourself; the
scaffolded `clean-vault/` folder provides the templates, dashboard, snippets, and folder
structure that can't be created from a GUI.

## What you'll have when done

- A dashboard (`INDEX.md`) with 5 sections and 15 `+ ADD ...` buttons.
- Buttons that open forms and create typed, tagged, iconed notes in the right folders.
- Atlas location hierarchy (plane → realm → continent/ocean → territory → province →
  locale → landmark) with auto-created subfolders.
- Auto-numbered session notes (`Session 01`, `Session 02`, ...).
- The Prism theme + 12 CSS snippets for the look.

## Steps at a glance

1. Open the vault
2. Install the Prism theme
3. Enable the 12 CSS snippets
4. Install + configure 7 community plugins (Templater, Dataview, Folder Notes, Style
   Settings, Icon Folder, Meta Bind, Modal Forms)
5. Verify everything works

## Before you start

- Obsidian Desktop, current release.
- The `clean-vault/` folder as scaffolded in this repo.
- The original Tasha's vault (this repo) kept somewhere for reference — the appendix uses
  its `.obsidian/plugins/<id>/data.json` files for exact-match configs.
- 45–60 minutes, mostly the two big plugins (Meta Bind, Modal Forms).
````

- [ ] **Step 2: Append "1. Open the vault"**

Append:

````markdown
## 1. Open the vault

1. Launch Obsidian → *Open folder as vault* → select the `clean-vault/` folder (the vault
   root, not the `.obsidian` folder).
2. On the *Trust author and enable plugins?* dialog there is nothing to enable yet (no
   plugins installed) — click through it.
3. Confirm you see `INDEX.md` with the five callout sections (NPC's, The Party, Locations,
   Lore & Mythos, Session Notes). Buttons will not work until Step 4.
````

- [ ] **Step 3: Append "2. Install the Prism theme"**

Append:

````markdown
## 2. Install the Prism theme

1. *Settings → Appearance → Manage* (under Themes) → search **Prism** (by Damian Korcz) →
   Install → Use.
2. *Settings → Appearance → Base color scheme*: **Dark**.
3. If Style Settings is installed (Step 4) you'll later restore the exact look; until then
   Prism's defaults are fine.
````

- [ ] **Step 4: Append "3. Enable the CSS snippets"**

Append:

````markdown
## 3. Enable the CSS snippets

1. Confirm the 12 files exist at `clean-vault/.obsidian/snippets/`:
   `Buttons.css`, `Callouts.css`, `Cards.css`, `Columns.css`,
   `Embed Adjustments.css`, `Image Adjustments.css`, `Lists.css`, `Modal Form.css`,
   `NPC Toggle.css`, `Popup.css`, `Prism Theme Edits.css`, `Tables.css`.
2. *Settings → Appearance → CSS snippets* → click the folder/reload icon, then toggle all
   12 **on**.
3. *Settings → Editor → Default view mode for new notes*: **Reading view** (matches the
   vault's preview-first design).
````

- [ ] **Step 5: Append "4. Plugins — install index"**

Append:

````markdown
## 4. Install & configure the plugins

Install every plugin from *Settings → Community plugins → Browse*, then enable it.
Configure each as described in its subsection. Two are quick (Templater, Dataview), two
are medium (Folder Notes, Style Settings), one is folder-by-folder (Icon Folder), and two
are the big ones (Meta Bind, Modal Forms) — they get a GUI walkthrough plus an appendix
JSON fallback.

| Plugin | Browse search | Why it's here |
|---|---|---|
| Templater | Templater | Runs the note templates (the automation engine) |
| Dataview | Dataview | Powers form dropdown queries + note queries |
| Folder Notes | Folder notes | Shows a note when you open a folder (Atlas subfolders) |
| Style Settings | Style Settings | Restores Prism theme toggles used by this vault |
| Icon Folder | Icon Folder | Renders the folder/file icons |
| Meta Bind | Meta Bind | Defines the `BUTTON[...]` dashboard buttons |
| Modal Forms | Modal Forms | Defines the popup forms each button opens |
````

- [ ] **Step 6: Append "4.1 Templater"**

Append:

````markdown
### 4.1 Templater

*Settings → Templater*:

- **Template folder location**: `Assets/Templates`
- **User script functions folder location** (under *User Script Functions*): `Assets/Templates`
- **Startup Templates**: add `Assets/Templates/STARTUP.md` (re-renders icons + enhances
  Meta Bind tags on vault open)
- **Trigger Templater on new file creation**: OFF
- **Enable folder templates**: ON (leave the folder/template pair empty)
- **Syntax highlighting**: ON
- **Enable ribbon icon**: OFF
````

- [ ] **Step 7: Append "4.2 Dataview"**

Append:

````markdown
### 4.2 Dataview

*Settings → Dataview* — only defaults matter here:

- **Enable Dataview queries**: ON
- **Enable JavaScript queries**: ON
- **Enable Inline Dataview**: ON
- Leave everything else default. (The dashboard uses Obsidian Bases, not Dataview, but
  Modal Form dropdowns and a few fields use Dataview queries.)
````

- [ ] **Step 8: Verify Part 1**

Run: `rg -n "4\.1 Templater|## 3\. Enable the CSS snippets|## 1\. Open the vault" CLEAN-VAULT-SETUP.md`
Expected: all three headings found with line numbers.

- [ ] **Step 9: No commit yet** (committed with the full guide in Task 9).

---

### Task 7: Write guide — Part 2: Folder Notes, Style Settings, Icon Folder, Meta Bind, Modal Forms

**Files:**
- Modify: `CLEAN-VAULT-SETUP.md` (append)

**Interfaces:**
- Consumes: button id → template → folder table (from Task 1/4 files and the current
  `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`); template → form map (Task 2
  step 3); form → fields map (from current `.obsidian/plugins/modalforms/data.json`).
- Produces: the plugin configuration sections of the guide.

- [ ] **Step 1: Append "4.3 Folder Notes"**

Append:

````markdown
### 4.3 Folder Notes

*Settings → Folder notes* (matches the current vault's `data.json`):

- **Open the folder note on click**: ON (plain click)
- **Sync the folder note name with the folder name**: ON
- **Hide the folder note**: ON
- **Automatically create folder notes for new folders**: OFF
- **Folder note storage location**: *Inside the folder*
- **Folder note name format**: `{{folder_name}}`
- **Folder note type**: `.md`
- **Deleting files**: Trash
- Leave everything else at defaults.
````

- [ ] **Step 2: Append "4.4 Style Settings"**

Append:

````markdown
### 4.4 Style Settings

*Settings → Style Settings* → section *Prism*. Restore the notable values from the current
vault (if a toggle is missing, leave default — the appendix JSON is the exact fallback):

- **Color scheme (dark)**: *Raven*
- **Dark accent color**: *Purple*
- **Accent style (dark)**: *Border + Filled*
- **Status bar**: *Hidden*
- **File line width**: `1335`
- **Headings — H1 size**: `2.4`; **H6 size**: `2.2`
- **Disable callout styling**: ON
- **Colored folders**: OFF
- Everything else: default. Use the appendix fallback if you want pixel-exact.
````

- [ ] **Step 3: Append "4.5 Icon Folder"**

Append:

````markdown
### 4.5 Icon Folder

*Settings → Icon Folder*:

1. **Icon font size**: `16`
2. **Show icons in notes**: ON
3. **Icon packs**: the icons used here are FontAwesome (`Fas*`), Remix (`Ri*`), and Lucide
   (`Li*`). Under *Settings → Icon Folder* install/download the **Font Awesome**, **Remix
   Icon**, and **Lucide** packs if prompted, so these prefixes resolve.
4. Set folder icons — right-click each folder in the file explorer → *Change Icon* →
   search/select:

| Folder | Icon |
|---|---|
| `Assets` | `FasFolder` |
| `Assets/Images` | `FasImagePortrait` |
| `Assets/Templates` | `FasNoteSticky` |
| `Compendium` | `FasFolder` |
| `Compendium/Atlas` | `LiGlobe` |
| `Compendium/Lore` | `FasBook` |
| `Compendium/NPC's` | `FasUserGroup` |
| `Compendium/Party` | `FasFlag` |
| `Compendium/Party/Player Characters` | `FasUser` |
| `Compendium/Party/Quests` | `RiErrorWarningFill` |
| `Compendium/Lore/Deities` | `FasPersonRays` |
| `Compendium/Lore/Events` | `FasCalendar` |
| `Compendium/Lore/Objects` | `FasWandMagicSparkles` |
| `Compendium/Lore/Organizations` | `LiNetwork` |
| `Session Notes` | `FasFolder` |

Note: icons inside the Atlas tree are applied automatically by the location templates when
you create notes (via `utils.js` + `STARTUP.md`), so you never set them manually.
````

- [ ] **Step 4: Append "4.6 Meta Bind (buttons)"**

Append:

````markdown
### 4.6 Meta Bind — the dashboard buttons

*Settings → Meta Bind → Button Templates* → **Add button**. For each of the 15 ids below
create a button:

- **Button id**: the id in the table (used by `BUTTON[...]` in `INDEX.md`)
- **Label**: the label in the table
- **Class**: `callButton`
- **Hidden**: ON (buttons only render where `BUTTON[...]` appears)
- **Action type**: *Templater Create Note*
- **Template file**: the template in the table
- **Folder path**: the folder in the table
- **File name**: `temp`
- **Open note after creation**: OFF

| id | Label | Template file | Folder path |
|---|---|---|---|
| `npc` | `+ ADD NPC` | `Assets/Templates/NPC.md` | `Compendium/NPC's` |
| `pc` | `+ ADD PLAYER` | `Assets/Templates/PLAYER.md` | `Compendium/Party/Player Characters` |
| `quest` | `+ ADD QUEST` | `Assets/Templates/QUEST.md` | `Compendium/Party/Quests` |
| `note` | `+ ADD NOTE` | `Assets/Templates/NOTE.md` | `Session Notes` |
| `plane` | `+ ADD PLANE` | `Assets/Templates/PLANE.md` | `/` (root — template re-moves it) |
| `realm` | `+ ADD REALM` | `Assets/Templates/REALM.md` | `Compendium/Atlas` |
| `continent` | `+ ADD CONTINENT` | `Assets/Templates/CONTINENT.md` | `/` (root — template re-moves it) |
| `territory` | `+ ADD TERRITORY` | `Assets/Templates/TERRITORY.md` | `Compendium/Atlas` |
| `province` | `+ ADD PROVINCE` | `Assets/Templates/PROVINCE.md` | `Compendium/Atlas` |
| `locale` | `+ ADD LOCALE` | `Assets/Templates/LOCALE.md` | `/` (root — template re-moves it) |
| `landmark` | `+ ADD LANDMARK` | `Assets/Templates/LANDMARK.md` | `/` (root — template re-moves it) |
| `deity` | `+ ADD DEITY` | `Assets/Templates/GOD.md` | `Compendium/Lore/Deities` |
| `event` | `+ ADD EVENT` | `Assets/Templates/EVENT.md` | `Compendium/Lore/Events` |
| `object` | `+ ADD OBJECT` | `Assets/Templates/OBJECT.md` | `Compendium/Lore/Objects` |
| `org` | `+ ADD ORGANIZATION` | `Assets/Templates/ORGANIZATION.md` | `Compendium/Lore/Organizations` |
````

- [ ] **Step 5: Append "4.7 Modal Forms"**

Append:

````markdown
### 4.7 Modal Forms — the popup forms

*Settings → Modal Forms → Form Definitions* → **Add form**. Create the 15 forms below.
Form names must match what each template calls (`MF.openForm('...')`):

| Form | Template that opens it | Fields (in order) |
|---|---|---|
| `NPC` | `NPC.md` | Name (text, **required**), Gender (dropdown: Male/Female/Non-Binary), Race, Affinity, Job, Location, Portrait |
| `PC` | `PLAYER.md` | Name, Race, Level, pClass, subClass, Quote, Portrait |
| `QUEST` | `QUEST.md` | Name, Status, Assignor, Assignee, Location, Image |
| `NOTE` | `NOTE.md` | Title, Date, Location, Tags, Banner |
| `PLANE` | `PLANE.md` | Name, Banner |
| `REALM` | `REALM.md` | Name, Location, Banner |
| `CONTINENT` | `CONTINENT.md` | Name, Type, Location, Banner |
| `TERRITORY` | `TERRITORY.md` | Name, Type, Location, Banner |
| `PROVINCE` | `PROVINCE.md` | Name, Type, Location, Banner |
| `LOCALE` | `LOCALE.md` | Name, Type, Location, Banner |
| `LANDMARK` | `LANDMARK.md` | Name, Type, Location, Banner |
| `EVENT` | `EVENT.md` | Name, Type, Image |
| `GOD` | `GOD.md` | Name, Gender, Alignment, Domains, Pantheon, Portrait |
| `OBJECT` | `OBJECT.md` | Name, Type, Image |
| `ORGANIZATION` | `ORGANIZATION.md` | Name, Alignment, Location, Image |

For each form, the dropdown/dataview sources and image fields (Banner/Portrait/Image) come
from the appendix JSON — build them from the GUI best-effort (a text field works for
testing), then use the appendix fallback to get exact match. **Never rename a form** once
templates depend on it.
````

- [ ] **Step 6: Verify Part 2**

Run:
```bash
rg -n "### 4\.7 Modal Forms|### 4\.6 Meta Bind|### 4\.5 Icon Folder|### 4\.4 Style Settings|### 4\.3 Folder Notes" CLEAN-VAULT-SETUP.md
```
Expected: all five headings found. Cross-check the button table against Task 4 step 4's
id union (15 ids) and the form table against Task 2 step 3's template→form map (incl. `PC`).

- [ ] **Step 7: No commit yet** (committed in Task 9).

---

### Task 8: Write guide — Part 3: appendix (exact-match JSON) + verification checklist

**Files:**
- Modify: `CLEAN-VAULT-SETUP.md` (append)

**Interfaces:**
- Consumes: the current vault's plugin `data.json` files (this repo, still present after
  the vault is moved out — the guide references them by repo-relative path).

- [ ] **Step 1: Append "5. Verification checklist"**

Append:

````markdown
## 5. Verification checklist

Go through this once all plugins are installed and enabled.

1. **Dashboard renders**: open `INDEX.md` in Reading view — all 5 callout sections show,
   Prism styling and snippets are active, and `BUTTON[...]` lines display as buttons.
2. **NPC flow**: click `BUTTON[npc]` → form opens with **Name** required → fill it →
   the note is created, renamed from `temp`, moved to `Compendium/NPC's/`, an icon is
   applied, and a Notice confirms success. Cancel path: closing the form creates nothing.
3. **PC + Quest**: `BUTTON[pc]` and `BUTTON[quest]` land in
   `Compendium/Party/Player Characters/` and `Compendium/Party/Quests/`.
4. **Atlas chain**: create Plane → Realm → Continent → Territory → Province → Locale →
   Landmark, each selecting the prior as parent. Confirm each lands in
   `Compendium/Atlas/<parent>/<Name>/<Name>.md` and the folder note + folder both get icons.
5. **Session numbering**: click `BUTTON[note]` twice → `Session Notes/Session 01.md` and
   `Session 02.md` (zero-padded, auto-numbered).
6. **Startup**: reload the vault → `STARTUP.md` runs via Templater, re-renders icons and
   enhances Meta Bind tags (no errors in the console).
7. **Images**: add an image to a note → it stores under `Assets/Images/<category>/` named
   with the `{{time}}` scheme.
````

- [ ] **Step 2: Append "Appendix — exact-match plugin configs (fallback)"**

Append:

````markdown
## Appendix — exact-match plugin configs

The GUI walkthroughs above reproduce the important settings. If you want the vault to match
this one pixel-for-pixel (every Meta Bind button, every Modal Form field, Folder Notes /
Icon Folder / Style Settings / Dataview internals), overwrite each plugin's `data.json`
with the copy from the original Tasha's vault **after** installing and enabling the plugin
(folders are created on install). The original vault is the repo this `clean-vault/` came
from; its plugin configs live under `.obsidian/plugins/<id>/data.json`.

For each plugin id in the table, replace the file in your new vault:

| Plugin | Plugin id (folder name) |
|---|---|
| Templater | `templater-obsidian` |
| Dataview | `dataview` |
| Folder Notes | `folder-notes` |
| Style Settings | `obsidian-style-settings` |
| Icon Folder | `obsidian-icon-folder` |
| Meta Bind | `obsidian-meta-bind-plugin` |
| Modal Forms | `modalforms` |

e.g. (run inside the repo that holds both vaults, after you've installed/enabled Meta Bind
in the new vault):

```bash
cp .obsidian/plugins/obsidian-meta-bind-plugin/data.json \
   clean-vault/.obsidian/plugins/obsidian-meta-bind-plugin/data.json
cp .obsidian/plugins/modalforms/data.json \
   clean-vault/.obsidian/plugins/modalforms/data.json
```

Restart Obsidian afterwards. Use this appendix either to (a) skip the tedious parts of 4.6
and 4.7, or (b) reconcile after the GUI work.

> Note: Icon Folder's `data.json` also stores per-folder/per-note icons for the *old*
> vault's content. Copying it will import those stale entries; they are harmless and only
> affect matching paths. The base-skeleton folder icons are the ones from the 4.5 table.
````

- [ ] **Step 3: Verify the full guide structure**

Run:
```bash
rg -n "^## " CLEAN-VAULT-SETUP.md
```
Expected headings, in order: `1. Open the vault`, `2. Install the Prism theme`,
`3. Enable the CSS snippets`, `4. Install & configure the plugins`,
`5. Verification checklist`, `Appendix — exact-match plugin configs`.

- [ ] **Step 4: Commit**

```bash
git add CLEAN-VAULT-SETUP.md
git commit -m "docs: add clean-vault setup guide (plugin install + config walkthrough)"
```

---

### Task 9: Final validation & commit of plan artifacts

**Files:**
- Create: `docs/superpowers/plans/2026-08-06-clean-vault-setup.md` (this plan)

**Interfaces:**
- Verifies the complete deliverable set is in place.

- [ ] **Step 1: Verify scaffold completeness**

Run:
```bash
find clean-vault -type f | sort
```
Expected exactly:
- 16 `.md` templates + `utils.js` under `Assets/Templates/`
- 12 `.css` under `.obsidian/snippets/`
- `INDEX.md`, `AGENTS.md`, `README.md`, `.gitignore` at the root
- **No** files anywhere under `.obsidian/plugins/`, `.obsidian/themes/`, `.obsidian/icons/`

- [ ] **Step 2: Verify nothing under clean-vault is tracked**

Run: `git status --porcelain`
Expected: only `.gitignore`, `CLEAN-VAULT-SETUP.md`, and this plan/spec are pending/tracked.
No `clean-vault/` entries.

- [ ] **Step 3: Verify the guide is self-consistent**

Run:
```bash
rg -c "BUTTON\[" CLEAN-VAULT-SETUP.md
rg -n "\| \`(npc|pc|quest|note|plane|realm|continent|territory|province|locale|landmark|deity|event|object|org)\`" CLEAN-VAULT-SETUP.md | wc -l
```
Expected: second command prints `15` (all 15 button ids documented in the guide table).

- [ ] **Step 4: Commit plan + spec already committed**

```bash
git add docs/superpowers/plans/2026-08-06-clean-vault-setup.md
git commit -m "docs: add clean-vault setup implementation plan"
```

- [ ] **Step 5: Report handoff**

State that the user's remaining work is purely in Obsidian per `CLEAN-VAULT-SETUP.md`
(Steps 1–5), that the appendix JSON-copy is the exact-match fallback, and that Obsidian
runs `STARTUP.md` on first open after Templater is configured.
