# Quest Status Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the read-only `quest/<state>` status tag on quest notes with a Meta Bind `inlineSelect` dropdown bound to a new `status` frontmatter property, and repoint the dashboard to read it.

**Architecture:** A quest note's status moves from `tags` to a `status` frontmatter property holding the same tag-style value (`quest/ongoing`). The quest subtitle renders a Meta Bind `inlineSelect` bound to `status` (the dropdown doubles as the status chip). INDEX.md's Quests Bases formulas switch from parsing `file.tags` to reading `file.status`. Existing quest notes are migrated in place; AGENTS.md is updated to match.

**Tech Stack:** Obsidian vault — Templater (`Assets/Templates/QUEST.md`), Meta Bind `inlineSelect` input field, Bases formulas in `INDEX.md`, plain Markdown edits for the three quest notes and AGENTS.md. No test tooling exists; verification is manual in Obsidian plus `grep`/JSON checks.

## Global Constraints

- Status vocabulary is fixed: `Pending`, `Ongoing`, `Completed`, `Failed`, `Abandoned` — do not add or rename states.
- Stored value format is `quest/<camelCase>` (e.g. `quest/ongoing`); the dropdown label is Title Case (e.g. `Ongoing`).
- `inlineSelect` option values and labels are wrapped in **single quotes** in the INPUT declaration.
- Quest status must live ONLY in the `status` property — no `quest/*` tag on quest notes.
- Do not change quest prose, descriptions, icons, or the HISTORY/QUESTS base blocks in the migrated notes.
- Frontmatter `type: quest` and the YAML empty-list convention (lone ` -` under `tags:`) are preserved.
- No changes to the QUEST modal form, Meta Bind button config, or `modalforms`/`meta-bind` `data.json` (spec Out of Scope).

---

### Task 1: Add `status` property + dropdown to the QUEST template

**Files:**
- Modify: `Assets/Templates/QUEST.md:13-15` (remove tag construction), `:29` (tags block), `:36` (subtitle line)

**Interfaces:**
- Produces: quest notes with frontmatter `status: quest/<state>` and a subtitle `inlineSelect` bound to `:status`. Task 2 depends on `status` existing; Task 3 reuses the exact INPUT line defined here.

- [ ] **Step 1: Remove the `tags` construction in the template script**

In `Assets/Templates/QUEST.md`, delete lines 13-15:

```js
const tags = [
    status && `quest/${toCamelCase(status)}`
].filter(Boolean).map(v => ` - ${v}`).join("\n") || " -";
```

The `status` const (line 8) and `toCamelCase` import (line 2) stay — `toCamelCase` is still used for the new `status` property value.

- [ ] **Step 2: Add `status` to frontmatter and empty the tags list**

Replace lines 24-30 with:

```yaml
type: quest
status: <% status? `quest/${toCamelCase(status)}`: 'quest/pending' %>
assignor: <% assignor? `"[[${assignor}]]"`: '' %>
assignee: <% assignee? `"[[${assignee}]]"`: '' %>
locations:
 - <% location? `"[[${location}]]"`: '' %>
tags:
 -
```

- [ ] **Step 3: Replace the subtitle status label with the dropdown**

Replace line 36:

```html
<span class="sub2">:FasCircleExclamation: Quest<% status? ` &nbsp; | &nbsp;:FasListCheck: ${status}`: '' %><% assignor? ` &nbsp; | &nbsp;:FasHandshakeSimple: [[${assignor}]]`: '' %><% assignee? ` &nbsp; | &nbsp;:FasUser: [[${assignee}]]`: '' %></span>
```

with:

```html
<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: `INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]`<% assignor? ` &nbsp; | &nbsp;:FasHandshakeSimple: [[${assignor}]]`: '' %><% assignee? ` &nbsp; | &nbsp;:FasUser: [[${assignee}]]`: '' %></span>
```

- [ ] **Step 4: Verify a newly created quest**

In Obsidian: dashboard → `BUTTON[quest]` → create a quest titled e.g. "Test Quest" with Status `Ongoing`. Expected:
- Frontmatter contains `status: quest/ongoing` and `tags:` with the lone ` -` (no `quest/*` tag).
- The subtitle shows a dropdown at `Ongoing` between the `Quest` and assignor/assignee segments.
- Changing the dropdown to `Completed` updates the frontmatter `status` to `quest/completed`.

Then create a second quest leaving Status blank. Expected: frontmatter `status: quest/pending`.

- [ ] **Step 5: Commit**

```bash
git add Assets/Templates/QUEST.md
git commit -m "feat: add status property and dropdown to quest template"
```

---

### Task 2: Repoint INDEX.md quest formulas to `file.status`

**Files:**
- Modify: `INDEX.md:114-121` (Quests callout `formulas:` block)

**Interfaces:**
- Consumes: `status` frontmatter property (Task 1).
- Produces: dashboard Status/StatusCard columns sourced from `file.status`.

- [ ] **Step 1: Replace the two quest formulas**

In `INDEX.md`, inside the `> [!agenda]- Quests` callout, replace:

```yaml
formulas:
  StatusCard: |
   list(file.tags)
     .map("(" + value.replace("#quest/", "") + ")")
  Status: |
   list(file.tags)
     .map(value.replace("#quest/", ""))
```

with:

```yaml
formulas:
  StatusCard: |
   "(" + (file.status ? file.status.replace("quest/", "") : "pending") + ")"
  Status: |
   file.status ? file.status.replace("quest/", "") : "pending"
```

Note the replace target is `"quest/"` (no `#`) — a property value has no hash prefix, unlike `file.tags`.

- [ ] **Step 2: Verify the dashboard**

In Obsidian: open `INDEX.md` in preview. Expected: the Quests cards/list show the newly created "Test Quest" from Task 1 with status `(ongoing)`. The three pre-existing quest notes currently show `(pending)` — this is the expected transient state until Task 3 migrates them.

- [ ] **Step 3: Commit**

```bash
git add INDEX.md
git commit -m "feat: read quest status from file.status in dashboard formulas"
```

---

### Task 3: Migrate the three existing quest notes

**Files:**
- Modify: `Compendium/Party/Quests/The Delivery.md:1-12`
- Modify: `Compendium/Party/Quests/Double Trouble.md:1-11`
- Modify: `Compendium/Party/Quests/Take Five.md:1-11`

**Interfaces:**
- Consumes: the exact INPUT line from Task 1.
- Produces: all quest notes conforming to the new `status`-property schema.

The shared INPUT line (reused verbatim in every subtitle below):

```
`INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]`
```

- [ ] **Step 1: Migrate "The Delivery"**

Frontmatter — replace the `tags:` block (lines 4-5):

```yaml
tags:
  - quest/ongoing
```

with:

```yaml
status: quest/ongoing
tags:
 -
```

Subtitle (line 12) — replace:

```html
<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: Ongoing &nbsp; | &nbsp;:FasUser: [[Tinkera Drenn]]</span>
```

with:

```html
<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: `INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]` &nbsp; | &nbsp;:FasUser: [[Tinkera Drenn]]</span>
```

- [ ] **Step 2: Migrate "Double Trouble"**

Frontmatter — replace the `tags:` block (lines 3-4):

```yaml
tags:
  - quest/pending
```

with:

```yaml
status: quest/pending
tags:
 -
```

Subtitle (line 11) — replace:

```html
<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: Pending </span>
```

with:

```html
<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: `INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]` </span>
```

- [ ] **Step 3: Migrate "Take Five"**

Frontmatter — replace the `tags:` block (lines 4-5):

```yaml
tags:
  - quest/completed
```

with:

```yaml
status: quest/completed
tags:
 -
```

Subtitle (line 12) — replace:

```html
<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: Completed </span>
```

with:

```html
<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: `INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]` </span>
```

- [ ] **Step 4: Verify all three migrated notes**

In Obsidian: open each note in preview. Expected: each subtitle shows a dropdown at its current state (Ongoing / Pending / Completed) and the frontmatter has `status:` plus an empty `tags:` list. Open `INDEX.md` — the three cards now show `(ongoing)`, `(pending)`, `(completed)` (no longer the fallback). Flip Double Trouble to `Abandoned`; the dashboard card updates to `(abandoned)` and the frontmatter reads `status: quest/abandoned`; flip it back.

- [ ] **Step 5: Commit**

```bash
git add "Compendium/Party/Quests/The Delivery.md" "Compendium/Party/Quests/Double Trouble.md" "Compendium/Party/Quests/Take Five.md"
git commit -m "feat: migrate existing quest notes to status property"
```

---

### Task 4: Update AGENTS.md

**Files:**
- Modify: `AGENTS.md:27` (tags convention), Conventions section (add status bullet)

**Interfaces:**
- Documents the `status` property produced in Tasks 1 and 3 and consumed in Task 2.

- [ ] **Step 1: Fix the tag-convention example**

Replace line 27:

```markdown
- Hierarchical tags in camelCase: `race/halfElf`, `affinity/friendly`, `job/waitress`, `quest/ongoing`, `class/bard`, `subclass/...`. `toCamelCase` strips spaces and dashes.
```

with:

```markdown
- Hierarchical tags in camelCase: `race/halfElf`, `affinity/friendly`, `job/waitress`, `quest/giver`, `class/bard`, `subclass/...`. `toCamelCase` strips spaces and dashes.
```

(`quest/giver` is the NPC tag actually in use — quest status is no longer a tag.)

- [ ] **Step 2: Add a quest-status convention bullet**

Immediately after the tags bullet (the line added in Step 1), add:

```markdown
- Quest status lives in the `status` frontmatter property (values `quest/pending | quest/ongoing | quest/completed | quest/failed | quest/abandoned`), rendered as a Meta Bind `inlineSelect` dropdown in the quest subtitle. The dashboard's Quests callout reads `file.status` — do not move quest status back into `quest/*` tags.
```

- [ ] **Step 3: Verify**

Run: `grep -n "quest/giver\|file.status\|inlineSelect" AGENTS.md`
Expected: the example line shows `quest/giver`; the new bullet mentions both `file.status` and the `inlineSelect` dropdown.

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs: document quest status property and dropdown"
```

---

## Self-Review Notes

- **Spec coverage:** §1 (property + dropdown) → Task 1; §2 (template) → Task 1; §3 (dashboard) → Task 2; §4 (migration) → Task 3; §5 (docs) → Task 4; Verification → each task's Obsidian steps.
- **Placeholders:** none — every edit includes exact old/new content.
- **Type consistency:** the `status` property is `quest/<camelCase>` throughout (template, migration, formulas strip `"quest/"`), and the single INPUT line is reused verbatim in Task 3.
