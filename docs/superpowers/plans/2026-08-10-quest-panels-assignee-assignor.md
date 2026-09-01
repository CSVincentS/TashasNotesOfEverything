# Quest Panels Assignee/Assignor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Change the QUESTS panels on player, party, NPC, and organization notes from a raw backlink filter (`file.hasLink(this.file)`) to a property-based filter on `assignee`/`assignor`, and backfill those properties on existing quests.

**Architecture:** Four Templater templates and ten existing generated notes embed Obsidian Bases (` ```base `) queries. The quest-panel filter line is swapped from `file.hasLink(this.file)` to `'list(<property>).contains(this)'` — the documented Bases pattern for matching a frontmatter link property against the note embedding the base (`this`). Three legacy quests get `assignor`/`assignee` frontmatter added (converting the obsolete `target` property to `assignee`).

**Tech Stack:** Obsidian Bases (core plugin) YAML filter syntax; Templater templates; plain Markdown frontmatter. No code tooling, no tests — verification is file-content inspection plus a manual check in Obsidian.

## Global Constraints

- Filter for assignee panels: `- 'list(assignee).contains(this)'` (PLAYER.md, PARTY.md, and their generated notes).
- Filter for assignor panels: `- 'list(assignor).contains(this)'` (NPC.md, ORGANIZATION.md, and their generated notes).
- Only the QUESTS panel is changed/added. HISTORY, MEMBERS, and NPC's panels keep `file.hasLink(this.file)`.
- Keep each file's existing base-block indentation: templates use `>`; older generated notes use `>>`.
- Keep existing callout types and panel `name:` values; NPC.md and its generated notes keep `order: - file.name`.
- Do not touch `.obsidian/plugins/*/data.json` — no form/button/config changes.
- Quest frontmatter property order follows the QUEST template: `assignor`, `assignee`, both after `tags`, before `type`. Empty assignor renders as a bare `assignor:` line.

---

### Task 1: Update the four templates

**Files:**
- Modify: `Assets/Templates/PLAYER.md:77`
- Modify: `Assets/Templates/PARTY.md:61`
- Modify: `Assets/Templates/NPC.md:68`
- Modify: `Assets/Templates/ORGANIZATION.md` (add QUESTS panel between the NPC's and HISTORY panels)

**Interfaces:**
- Consumes: none (this is the first task).
- Produces: the exact filter lines later tasks reuse verbatim — `'list(assignee).contains(this)'` and `'list(assignor).contains(this)'`.

- [ ] **Step 1: Change PLAYER.md quest filter**

In `Assets/Templates/PLAYER.md`, inside the QUESTS base block, replace:

```
        - file.hasLink(this.file)
```

with:

```
        - 'list(assignee).contains(this)'
```

- [ ] **Step 2: Change PARTY.md quest filter**

In `Assets/Templates/PARTY.md`, inside the QUESTS base block (name: Quests), apply the same replacement as Step 1.

- [ ] **Step 3: Change NPC.md quest filter**

In `Assets/Templates/NPC.md`, inside the QUESTS base block, replace:

```
        - file.hasLink(this.file)
```

with:

```
        - 'list(assignor).contains(this)'
```

Leave the `order: - file.name` block that follows the filter untouched.

- [ ] **Step 4: Add QUESTS panel to ORGANIZATION.md**

In `Assets/Templates/ORGANIZATION.md`, between the closing `>` of the NPC's panel and the `> > [!note]- HISTORY` line, insert the following block (matching the template's single-`>` indentation and the NPC template's QUESTS panel style):

```
> > [!info]- QUESTS
> >
> > ```base
> > properties:
> >   file.name:
> >     displayName: Name
> > views:
> >   - type: table
> >     name: Name
> >     filters:
> >       and:
> >         - file.inFolder("Compendium/Party/Quests")
> >         - 'list(assignor).contains(this)'
> >     order:
> >       - file.name
> > ```
```

The file should now have three nested panels in order: NPC's, QUESTS, HISTORY.

- [ ] **Step 5: Verify template edits**

Run: `rg -n "hasLink|list\(" Assets/Templates/PLAYER.md Assets/Templates/PARTY.md Assets/Templates/NPC.md Assets/Templates/ORGANIZATION.md`
Expected: `hasLink` appears only inside HISTORY panels (and the NPC's panel of ORGANIZATION.md); each QUESTS panel shows `list(assignee)` (PLAYER, PARTY) or `list(assignor)` (NPC, ORGANIZATION).

- [ ] **Step 6: Commit**

```bash
git add Assets/Templates/PLAYER.md Assets/Templates/PARTY.md Assets/Templates/NPC.md Assets/Templates/ORGANIZATION.md
git commit -m "feat: filter quest panels by assignee/assignor in templates"
```

---

### Task 2: Backfill assignor/assignee on existing quests

**Files:**
- Modify: `Compendium/Party/Quests/Double Trouble.md`
- Modify: `Compendium/Party/Quests/The Delivery.md`
- Modify: `Compendium/Party/Quests/Take Five.md`

**Interfaces:**
- Consumes: the property names from Task 1 (`assignor`, `assignee`).
- Produces: quest notes whose frontmatter carries `assignor`/`assignee` so the new panels (Tasks 1 and 3) have data to match.

- [ ] **Step 1: Backfill Double Trouble.md**

Replace the `target:` line with `assignor:` and `assignee:` lines. Specifically, replace:

```
target: "[[Alaric Waycrest]]"
```

with:

```
assignor:
assignee: "[[Alaric Waycrest]]"
```

- [ ] **Step 2: Backfill The Delivery.md**

Replace:

```
target: groupQuest
```

with:

```
assignor: "[[Tinkera Drenn]]"
assignee: "[[LASTSTAND]]"
```

- [ ] **Step 3: Backfill Take Five.md**

Replace:

```
target: groupQuest
```

with:

```
assignor:
assignee: "[[LASTSTAND]]"
```

- [ ] **Step 4: Verify backfill**

Run: `rg -n "assignor|assignee|target" Compendium/Party/Quests/`
Expected: no `target` remains; each quest has `assignor:` and `assignee:` lines with the values above.

- [ ] **Step 5: Commit**

```bash
git add "Compendium/Party/Quests/Double Trouble.md" "Compendium/Party/Quests/The Delivery.md" "Compendium/Party/Quests/Take Five.md"
git commit -m "fix: backfill assignor/assignee on existing quest notes"
```

---

### Task 3: Apply assignee filter to existing PC and party notes

**Files:**
- Modify: `Compendium/Party/Player Characters/Alaric Waycrest.md`
- Modify: `Compendium/Party/Player Characters/Kingston Yashkar.md`
- Modify: `Compendium/Party/Player Characters/Moira Belkas.md`
- Modify: `Compendium/Party/Player Characters/Tilda Rosesong.md`
- Modify: `Compendium/Party/LASTSTAND.md` (add QUESTS panel)

**Interfaces:**
- Consumes: filter `'list(assignee).contains(this)'` and the quest data from Task 2.
- Produces: PC/party pages whose quest panels show only quests where `assignee` links back to the page.

- [ ] **Step 1: Update the four PC pages**

In each of the four PC files, inside the QUESTS panel (the base block whose filters contain `file.inFolder("Compendium/Party/Quests")`), replace the line:

```
>>         - file.hasLink(this.file)
```

with:

```
>>         - 'list(assignee).contains(this)'
```

Use the `>>         -` (two-chevron, 8-space) indentation shown above — the generated notes use `>>` for their base blocks. Do NOT touch the HISTORY panel (its filter uses `file.inFolder("Session Notes")`).

- [ ] **Step 2: Add QUESTS panel to LASTSTAND.md**

In `Compendium/Party/LASTSTAND.md`, between the closing `>` of the NPC's panel and the `> > [!note]- HISTORY` line, insert:

```
> > [!info]- QUESTS
> >
>> ```base
>> properties:
>>   file.name:
>>     displayName: Name
>> views:
>>   - type: table
>>     name: Quests
>>     filters:
>>       and:
>>         - file.inFolder("Compendium/Party/Quests")
>>         - 'list(assignee).contains(this)'
>> ```
```

The file should now have three nested panels in order: NPC's, QUESTS, HISTORY.

- [ ] **Step 3: Verify**

Run: `rg -n "hasLink|list\(" Compendium/Party/Player\ Characters/ Compendium/Party/LASTSTAND.md`
Expected: QUESTS panels show `list(assignee)`; `hasLink` remains only in HISTORY and NPC's panels.

- [ ] **Step 4: Commit**

```bash
git add "Compendium/Party/Player Characters/Alaric Waycrest.md" "Compendium/Party/Player Characters/Kingston Yashkar.md" "Compendium/Party/Player Characters/Moira Belkas.md" "Compendium/Party/Player Characters/Tilda Rosesong.md" Compendium/Party/LASTSTAND.md
git commit -m "fix: filter PC and party quest panels by assignee"
```

---

### Task 4: Apply assignor filter to existing NPC and organization notes

**Files:**
- Modify: `Compendium/NPC's/Tinkera Drenn.md`
- Modify: `Compendium/NPC's/Rythe Sterling.md`
- Modify: `Compendium/NPC's/Eleidin Verlice.md`
- Modify: `Compendium/NPC's/Paloma Beltre.md`
- Modify: `Compendium/Lore/Organizations/Black Fingers.md` (add QUESTS panel)
- Modify: `Compendium/Lore/Organizations/Fellows of Free Fate.md` (add QUESTS panel)

**Interfaces:**
- Consumes: filter `'list(assignor).contains(this)'`.
- Produces: NPC/org pages whose quest panels show only quests where `assignor` links back to the page.

- [ ] **Step 1: Update the four NPC pages**

In each of the four NPC files, inside the QUESTS panel (filters contain `file.inFolder("Compendium/Party/Quests")`), replace:

```
>>         - file.hasLink(this.file)
```

with:

```
>>         - 'list(assignor).contains(this)'
```

Leave the `order: - file.name` block below untouched. Do NOT touch HISTORY panels. (Note the apostrophe in the folder path `Compendium/NPC's` is only relevant to the NPC's panels, which are not being edited.)

- [ ] **Step 2: Add QUESTS panel to both organization files**

In `Compendium/Lore/Organizations/Black Fingers.md` and `Compendium/Lore/Organizations/Fellows of Free Fate.md`, between the closing `>` of the NPC's panel and the `> > [!note]- HISTORY` line, insert:

```
> > [!info]- QUESTS
> >
>> ```base
>> properties:
>>   file.name:
>>     displayName: Name
>> views:
>>   - type: table
>>     name: Name
>>     filters:
>>       and:
>>         - file.inFolder("Compendium/Party/Quests")
>>         - 'list(assignor).contains(this)'
>>     order:
>>       - file.name
>> ```
```

- [ ] **Step 3: Verify**

Run: `rg -n "hasLink|list\(" "Compendium/NPC's/" Compendium/Lore/Organizations/`
Expected: QUESTS panels show `list(assignor)`; `hasLink` remains only in HISTORY and NPC's panels.

- [ ] **Step 4: Commit**

```bash
git add "Compendium/NPC's/Tinkera Drenn.md" "Compendium/NPC's/Rythe Sterling.md" "Compendium/NPC's/Eleidin Verlice.md" "Compendium/NPC's/Paloma Beltre.md" Compendium/Lore/Organizations/Black\ Fingers.md Compendium/Lore/Organizations/Fellows\ of\ Free\ Fate.md
git commit -m "fix: filter NPC and organization quest panels by assignor"
```

---

### Task 5: Manual verification in Obsidian

**Files:** none.

- [ ] **Step 1: Validate panel results in Obsidian**

Open the vault in Obsidian and confirm:
- **Alaric Waycrest** (PC) QUESTS panel lists **Double Trouble** (assignee = Alaric).
- **LASTSTAND** (party) QUESTS panel lists **Take Five** and **The Delivery** (assignee = LASTSTAND).
- **Tinkera Drenn** (NPC) QUESTS panel lists **The Delivery** (assignor = Tinkera).
- **Double Trouble** and **Take Five** (assignor empty) appear in no assignor-filtered NPC/org panel.
- Organization pages show the new QUESTS panel (empty for now, since no quest has those orgs as assignor).

- [ ] **Step 2: Confirm no unrelated regression**

Spot-check that the HISTORY panels on a PC, an NPC, an org, and a party page still list session notes, and that NPC's panels on org/party pages still list NPCs.

- [ ] **Step 3: Commit if anything changed during verification**

```bash
git status
# commit only if verification surfaced a needed fix
```
