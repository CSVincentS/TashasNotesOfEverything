# Add "Add Party" Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up the existing `PARTY` modal form end to end so the dashboard can create party notes.

**Architecture:** Create a new `PARTY.md` Templater template (following the `PLAYER.md`/`QUEST.md` pattern) that opens the existing `PARTY` form and builds a note in `Compendium/Party/`, register a Meta Bind button for it, and add the button to the dashboard.

**Tech Stack:** Templater (`tp.user.utils`), Meta Bind plugin JSON config, Modal Forms plugin (form already exists), Obsidian Bases (`base` code blocks).

## Global Constraints

- `type: party` is NOT added to AGENTS.md's frontmatter type list (deliberately out of scope).
- The Meta Bind button id must be `party`, matching template file name `PARTY.md` and form name `PARTY`.
- The note must land directly in `Compendium/Party/` (the QUEST form's "Assigned to" query depends on `p.file.folder === "Compendium/Party"`).
- Button config shape must match existing buttons in `buttonTemplates` (label `ADD PARTY`, class `callButton`, hidden `true`, action `templaterCreateNote` with `fileName: "temp"`, `openNote: false`).
- Both plugin `data.json` files must remain valid JSON after edits.
- No comments in generated template code; follow existing template style exactly.

---

### Task 1: Create `PARTY.md` template

**Files:**
- Create: `Assets/Templates/PARTY.md`

**Interfaces:**
- Consumes: `tp.user.utils.openForm(name, label)`, `tp.user.utils.applyIcon(path, icon)`, `tp.user.utils.moveAndOpenFile(tp, name)`, `tp.user.utils.notifySuccess(label, name)` — all already exist in `Assets/Scripts/utils.js` and are used identically by `PLAYER.md`.
- Produces: `Assets/Templates/PARTY.md`, a runnable Templater template. Later tasks reference only this file path, so no further interfaces.

- [ ] **Step 1: Write the template**

Create `Assets/Templates/PARTY.md` with exactly this content (modeled on `PLAYER.md`):

```markdown
<%*
const { openForm, applyIcon, notifySuccess, moveAndOpenFile } = tp.user.utils;

const result = await openForm('PARTY', 'Party');
if (!result) return;

const name = result.Name.value;
const tags = " -";

applyIcon(`Compendium/Party/${name}.md`, "FasPeopleGroup");
await moveAndOpenFile(tp, name);
notifySuccess("party", name);
-%>

---

type: party
tags:
<% tags %>

---

###### <% name %>

<span class="sub2">:FasPeopleGroup: Party</span>

___

> [!quote|no-t]
> Party description here...

> [!column|flex 3]
>
> > [!info]- MEMBERS
> >
> > ```base
> > properties:
> >   file.name:
> >     displayName: Name
> > views:
> >   - type: table
> >     name: Members
> >     filters:
> >       and:
> >         - file.inFolder("Compendium/Party/Player Characters")
> >         - file.hasLink(this.file)
> > ```
>
> > [!info]- QUESTS
> >
> > ```base
> > properties:
> >   file.name:
> >     displayName: Name
> > views:
> >   - type: table
> >     name: Quests
> >     filters:
> >       and:
> >         - file.inFolder("Compendium/Party/Quests")
> >         - file.hasLink(this.file)
> > ```
>
> > [!note]- HISTORY
> >
> > ```base
> > properties:
> >   file.name:
> >     displayName: Name
> > views:
> >   - type: table
> >     name: Session Notes
> >     filters:
> >       and:
> >         - file.inFolder("Session Notes")
> >         - file.hasLink(this.file)
> > ```
```

Notes:
- `moveAndOpenFile` with no `newPath` renames the file (created as `temp.md` in the Meta Bind target folder) to `<Name>` inside the same folder, so it stays in `Compendium/Party/`.
- `tags` is `" -"` (a lone dash), matching the empty-list convention for YAML lists in this vault.

- [ ] **Step 2: Validate template syntax**

Run:
```bash
ls -la /home/default/Desktop/Tashas-Notes-of-Everything/Assets/Templates/PARTY.md
```
Expected: file exists. Confirm the `<%* ... -%>` script section and `MF.openForm` path match `PLAYER.md` (open the file and diff the script header against `Assets/Templates/PLAYER.md` lines 1-24).

- [ ] **Step 3: Commit**

```bash
git add Assets/Templates/PARTY.md
git commit -m "feat: add party template"
```

---

### Task 2: Register Meta Bind button

**Files:**
- Modify: `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`

**Interfaces:**
- Consumes: button id `party` → template file `Assets/Templates/PARTY.md` (from Task 1), folder `Compendium/Party`.
- Produces: `id: "party"` button in `buttonTemplates`, referenced as `BUTTON[party]` in Task 3.

- [ ] **Step 1: Add the button entry**

Edit `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`. Insert a new object into the `buttonTemplates` array. Add it right after the existing `pc` button entry (the last object in `buttonTemplates`, currently ending at the `"icon": ""` line before the closing `]`), with the same shape:

```json
    {
      "label": "ADD PARTY",
      "hidden": true,
      "class": "callButton",
      "tooltip": "",
      "id": "party",
      "style": "default",
      "actions": [
        {
          "type": "templaterCreateNote",
          "templateFile": "Assets/Templates/PARTY.md",
          "folderPath": "Compendium/Party",
          "fileName": "temp",
          "openNote": false
        }
      ],
      "icon": ""
    }
```

Precise edit: the `pc` entry ends with:
```json
      ],
      "icon": ""
    }
  ],
```
Change that `}` (pc's closing brace) to be followed by a comma, then the new object, then keep `  ],`.

- [ ] **Step 2: Validate JSON**

Run:
```bash
python3 -m json.tool /home/default/Desktop/Tashas-Notes-of-Everything/.obsidian/plugins/obsidian-meta-bind-plugin/data.json > /dev/null
```
Expected: exits 0, no output. (If `python3` is unavailable, use `node -e "JSON.parse(require('fs').readFileSync('.obsidian/plugins/obsidian-meta-bind-plugin/data.json'))"`.)

- [ ] **Step 3: Commit**

```bash
git add .obsidian/plugins/obsidian-meta-bind-plugin/data.json
git commit -m "feat: register party meta bind button"
```

---

### Task 3: Add button to dashboard

**Files:**
- Modify: `INDEX.md:118`

**Interfaces:**
- Consumes: `id: "party"` button registered in Task 2.
- Produces: rendered `BUTTON[party]` on the dashboard.

- [ ] **Step 1: Add the button**

In `INDEX.md`, the The Party callout's button line is currently:

```markdown
> `BUTTON[pc]` `BUTTON[quest]`
```

Replace it with:

```markdown
> `BUTTON[party]` `BUTTON[pc]` `BUTTON[quest]`
```

- [ ] **Step 2: Verify**

Run:
```bash
grep -n "BUTTON\[party\]" /home/default/Desktop/Tashas-Notes-of-Everything/INDEX.md
```
Expected: one match on the The Party callout line.

- [ ] **Step 3: Commit**

```bash
git add INDEX.md
git commit -m "feat: add add-party button to dashboard"
```

---

## Self-Review Notes

**Spec coverage:**
- Template with icon, move, notice, `type: party`, and MEMBERS/QUESTS/HISTORY panels → Task 1.
- Meta Bind button (`id: party`, `ADD PARTY`, folder `Compendium/Party`) → Task 2.
- Dashboard `BUTTON[party]` next to `BUTTON[pc] BUTTON[quest]` → Task 3.
- Both `data.json` files valid → Task 2 Step 2.

**Placeholder scan:** All steps contain full code/snippets; no TODOs.

**Type consistency:** Button id `party` is consistent across Task 2 and Task 3; template path `Assets/Templates/PARTY.md` matches the form name `PARTY` and file name across all tasks.

**Verification (manual, in Obsidian):** Dashboard → Add Party → modal appears → create → note at `Compendium/Party/<Name>.md` with `FasPeopleGroup` icon, opens in preview, panels render. Not automatable in this repo (no test tooling).
