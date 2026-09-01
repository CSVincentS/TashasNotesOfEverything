# sub2 Span Enrichment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enrich the `sub2` header spans in DEITY, OBJECT, ORGANIZATION, and QUEST templates to surface form fields (rank, rarity/magic/cursed status, category/type, assignee) that were added in the recent modal form expansion.

**Architecture:** Pure template edits in `Assets/Templates/*.md`. Each template reads values from its modal form via `result.<Field>.value` and renders a conditional `sub2` span using existing Templater patterns (`<% x? \`segment\`: '' %>`). Only OBJECT gains new consts; the rest only change the span markup.

**Tech Stack:** Templater (JavaScript in `<%* ... %>` blocks), Obsidian markdown.

## Global Constraints

- Only `Assets/Templates/DEITY.md`, `OBJECT.md`, `ORGANIZATION.md`, `QUEST.md` change. No form config, no `utils.js`.
- Preserve the existing conditional-segment style: `<% x? \`&nbsp; | &nbsp;:...\`: '' %>`.
- The four exact final spans are specified verbatim below; copy them exactly (including the backtick-template-literal quoting as shown).
- OBJECT: new consts go in form field order (after `type`, before `image`): `magical`, `cursed`, `rarity`.

---
### Task 1: Update the four `sub2` spans

**Files:**
- Modify: `Assets/Templates/DEITY.md:34`
- Modify: `Assets/Templates/OBJECT.md:9-11` (consts) and `Assets/Templates/OBJECT.md:30` (span)
- Modify: `Assets/Templates/ORGANIZATION.md:29`
- Modify: `Assets/Templates/QUEST.md:36`

**Interfaces:**
- Consumes: modal form results (`result.Rank.value`, `result.Magical.value`, `result.Cursed.value`, `result.Rarity.value`, `result.Category.value`, `result.Type.value`, `result.Assignor.value`, `result.Assignee.value`, `result.Alignment.value`, `result.Status.value`) and existing consts `icon`, `name`.
- Produces: four updated `sub2` spans; three new consts in OBJECT (`magical`, `cursed`, `rarity`) used only by OBJECT's span.

- [ ] **Step 1: Read the four current templates**

Read `Assets/Templates/DEITY.md`, `Assets/Templates/OBJECT.md`, `Assets/Templates/ORGANIZATION.md`, `Assets/Templates/QUEST.md` to confirm current line content before editing.

- [ ] **Step 2: Update DEITY.md span**

Edit `Assets/Templates/DEITY.md` so the `sub2` span is exactly:

```
<span class="sub2">:FasCross: <% rank? rank : 'Deity' %><% alignment? `&nbsp; | &nbsp;:FasYinYang: ${alignment}`: '' %></span>
```

(Replace the previous `:FasCross: Deity <% alignment? ... %>` form.)

- [ ] **Step 3: Add OBJECT consts**

Edit `Assets/Templates/OBJECT.md` so the const block reads (form field order):

```
const name = result.Name.value;
const type = result.Type.value;
const magical = result.Magical.value;
const cursed = result.Cursed.value;
const rarity = result.Rarity.value;
const image = result.Image.value || "Assets/Images/Placeholder/embed.jpg"
```

(Insert `magical`, `cursed`, `rarity` between the existing `type` and `image` lines.)

- [ ] **Step 4: Update OBJECT.md span**

Edit `Assets/Templates/OBJECT.md` so the `sub2` span is exactly:

```
<span class="sub2">:${icon}: <% [rarity, cursed && 'Cursed', magical && 'Magic', type].filter(Boolean).join(' ') %></span>
```

(Replace the previous `:${icon}: ${type}` form.)

- [ ] **Step 5: Update ORGANIZATION.md span**

Edit `Assets/Templates/ORGANIZATION.md` so the `sub2` span is exactly:

```
<span class="sub2">:FasSitemap: <% category && type ? `${category} ${type}` : type ? type : category ? `${category} Organization` : 'Organization' %></span>
```

(Replace the previous static `:FasSitemap: Organization`.)

- [ ] **Step 6: Update QUEST.md span**

Edit `Assets/Templates/QUEST.md` so the `sub2` span is exactly:

```
<span class="sub2">:FasCircleExclamation: Quest<% status? ` &nbsp; | &nbsp;:FasListCheck: ${status}`: '' %><% assignor? ` &nbsp; | &nbsp;:FasHandshakeSimple: [[${assignor}]]`: '' %><% assignee? ` &nbsp; | &nbsp;:FasUser: [[${assignee}]]`: '' %></span>
```

(Assignor icon changed `:FasUser:` → `:FasHandshakeSimple:`; assignee segment appended.)

- [ ] **Step 7: Validate the diff**

Run: `git diff Assets/Templates/DEITY.md Assets/Templates/OBJECT.md Assets/Templates/ORGANIZATION.md Assets/Templates/QUEST.md`

Verify: each of the four files shows only the intended span/const change, and the four final spans match the spec verbatim. No other files are modified.

- [ ] **Step 8: Commit**

```bash
git add Assets/Templates/DEITY.md Assets/Templates/OBJECT.md Assets/Templates/ORGANIZATION.md Assets/Templates/QUEST.md
git commit -m "feat: enrich sub2 spans with new form fields"
```
