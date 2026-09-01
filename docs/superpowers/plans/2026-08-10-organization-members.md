# Organization Members Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `ADD MEMBER` button to organization notes that links an existing NPC or Player Character to the org (with an optional role), plus a MEMBERS panel and an updated NPC's panel driven by a new `organizations` frontmatter property on NPC/PC notes.

**Architecture:** A Meta Bind button (`runTemplaterFile` action) runs a new JS-only Templater template that opens a Modal Form and writes `{ org, role }` objects into the chosen NPC/PC note's `organizations` frontmatter via `app.fileManager.processFrontMatter`. Bases panels on the organization note filter on that property (`list(organizations).map(value.org).contains(this)`) and derive the role (`list(organizations).filter(value.org == this).map(value.role)[0]`).

**Tech Stack:** Obsidian vault — Templater templates, Meta Bind buttons, Modal Forms, Bases (core plugin) panels, `processFrontMatter`.

## Global Constraints

- Keep the triad in sync: button id `orgMember` ↔ template file `Assets/Templates/ADD_ORG_MEMBER.md` ↔ Modal Form name `ORG_MEMBER`.
- Both plugin `data.json` files must stay valid JSON.
- The `Compendium/NPC's` folder apostrophe must stay escaped in the dataview query: `dv.pages('\"Compendium/NPC\\'s\"')` (JSON-escaped `\\'`), matching the QUEST form's assignor query exactly.
- Follow vault panel style: callouts nested under `> [!column|flex 3]`; templates use `> > ` prefixes, generated notes use `>> ` prefixes inside base code blocks.
- `organizations` is a YAML list of `{ org: "[[Org Name]]", role }` objects; `role` is omitted when blank.
- No automated test framework exists. Template changes are validated by JSON/syntax checks plus the final manual Obsidian run-through in Task 8.
- Use existing helpers from `Assets/Scripts/utils.js`: `openForm(name, label)` (cancellation notice on non-`ok`), and the vault's `new Notice().noticeEl.innerHTML = ...` styling for feedback.

---

### Task 1: Add the `ORG_MEMBER` Modal Form

**Files:**
- Modify: `.obsidian/plugins/modalforms/data.json` (insert new form definition into the `formDefinitions` array, after the `PC` form which is the last element)

**Interfaces:**
- Consumes: nothing.
- Produces: form named `ORG_MEMBER` with fields `Member` (string) and `Role` (string). Task 3 calls `openForm('ORG_MEMBER', 'member')` and reads `result.Member.value` / `result.Role.value`.

- [ ] **Step 1: Insert the form definition**

Read the end of `.obsidian/plugins/modalforms/data.json`. The `formDefinitions` array ends with the `PC` form's closing `}` at the current last line, immediately before the array-closing `]`. Change the last element's trailing `}` to `},` and append this new object before the closing `]`:

```json
    {
      "title": "Add Organization Member",
      "name": "ORG_MEMBER",
      "fields": [
        {
          "name": "Member",
          "label": "Member:",
          "description": "",
          "isRequired": true,
          "input": {
            "type": "dataview",
            "query": "[...dv.pages('\"Compendium/NPC\\'s\"').file.name, ...dv.pages('\"Compendium/Party/Player Characters\"').file.name]"
          }
        },
        {
          "name": "Role",
          "label": "Role:",
          "description": "",
          "isRequired": false,
          "input": {
            "type": "text",
            "hidden": false
          }
        }
      ],
      "version": "1"
    }
```

- [ ] **Step 2: Verify JSON validity and the form exists**

```bash
jq empty .obsidian/plugins/modalforms/data.json && jq -e '.formDefinitions[] | select(.name == "ORG_MEMBER")' .obsidian/plugins/modalforms/data.json >/dev/null
```

Expected: no output and exit code 0.

- [ ] **Step 3: Commit**

```bash
git add .obsidian/plugins/modalforms/data.json
git commit -m "feat: add ORG_MEMBER form for adding members to organizations"
```

---

### Task 2: Add the `orgMember` Meta Bind button

**Files:**
- Modify: `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` (insert a new button into `buttonTemplates`, after the `org` button)

**Interfaces:**
- Consumes: nothing.
- Produces: hidden button `orgMember` (referenced in notes as `` `BUTTON[orgMember]` ``) whose `runTemplaterFile` action targets the template created in Task 3.

- [ ] **Step 1: Insert the button definition**

Read `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`. Insert this object after the `org` button's closing `}` (the object with `"id": "org"`, `"label": "ADD ORGANIZATION"`) and before the `object` button:

```json
    {
      "label": "ADD MEMBER",
      "hidden": true,
      "class": "callButton",
      "tooltip": "",
      "id": "orgMember",
      "style": "default",
      "actions": [
        {
          "type": "runTemplaterFile",
          "templateFile": "Assets/Templates/ADD_ORG_MEMBER.md"
        }
      ],
      "icon": ""
    }
```

- [ ] **Step 2: Verify JSON validity and the button exists**

```bash
jq empty .obsidian/plugins/obsidian-meta-bind-plugin/data.json && jq -e '.buttonTemplates[] | select(.id == "orgMember")' .obsidian/plugins/obsidian-meta-bind-plugin/data.json >/dev/null
```

Expected: no output and exit code 0.

- [ ] **Step 3: Commit**

```bash
git add .obsidian/plugins/obsidian-meta-bind-plugin/data.json
git commit -m "feat: add orgMember button wiring members to runTemplaterFile action"
```

---

### Task 3: Create the `ADD_ORG_MEMBER.md` linking script

**Files:**
- Create: `Assets/Templates/ADD_ORG_MEMBER.md`

**Interfaces:**
- Consumes: form `ORG_MEMBER` (Task 1) via `tp.user.utils.openForm`; button `orgMember` (Task 2) is the entry point.
- Produces: writes `organizations` frontmatter on an existing NPC/PC note. This is the single writer of the `organizations` property for the whole feature.

- [ ] **Step 1: Write the template**

```markdown
<%*
const { openForm } = tp.user.utils;

const orgName = tp.file.basename;

const result = await openForm('ORG_MEMBER', 'member');
if (!result) return;

const member = result.Member.value;
const role = (result.Role.value || "").trim();
if (!member) return;

const memberFile = app.vault.getMarkdownFiles().find(f =>
    f.basename === member &&
    (f.path.startsWith("Compendium/NPC's/") || f.path.startsWith("Compendium/Party/Player Characters/"))
);
if (!memberFile) {
    new Notice().noticeEl.innerHTML = `<span style="color: red; font-weight: bold;">Error:</span><br>Could not find a note for <span style="text-decoration: underline;">${member}</span>`;
    return;
}

const orgLink = `[[${orgName}]]`;
let alreadyMember = false;
let added = false;

await app.fileManager.processFrontMatter(memberFile, fm => {
    const orgs = Array.isArray(fm.organizations) ? fm.organizations : [];
    alreadyMember = orgs.some(o => o && o.org === orgLink);
    if (alreadyMember) return;
    const entry = { org: orgLink };
    if (role) entry.role = role;
    fm.organizations = [...orgs, entry];
    added = true;
});

if (alreadyMember) {
    new Notice().noticeEl.innerHTML = `<span style="color: orange; font-weight: bold;">Already a member:</span><br>${member} is already part of <span style="text-decoration: underline;">${orgName}</span>`;
} else if (added) {
    new Notice().noticeEl.innerHTML = `<span style="color: green; font-weight: bold;">Finished!</span><br>${member} added to <span style="text-decoration: underline;">${orgName}</span>${role ? ` as ${role}` : ''}`;
}
-%>
```

- [ ] **Step 2: Syntax-check the embedded JS**

```bash
node -e '
const fs = require("fs");
const s = fs.readFileSync("Assets/Templates/ADD_ORG_MEMBER.md", "utf8");
const m = s.match(/<%*\n([\s\S]*?)\n-%>/);
if (!m) { console.error("script block not found"); process.exit(1); }
fs.writeFileSync("/tmp/opencode/org_member_check.js", m[1]);
'
node --check /tmp/opencode/org_member_check.js
```

Expected: `node --check` prints nothing (syntax OK). The globals (`app`, `tp`, `MF`, `Notice`) are runtime-only and intentionally unresolved in this check.

- [ ] **Step 3: Commit**

```bash
git add Assets/Templates/ADD_ORG_MEMBER.md
git commit -m "feat: add ADD_ORG_MEMBER template linking members to an organization"
```

---

### Task 4: Add the `organizations` property to NPC and PC templates

**Files:**
- Modify: `Assets/Templates/NPC.md` (frontmatter)
- Modify: `Assets/Templates/PLAYER.md` (frontmatter)

**Interfaces:**
- Consumes: nothing new (uses existing `tp.user.utils` destructuring unchanged).
- Produces: NPC/PC notes generated going forward carry an empty `organizations:` list, so the property exists before the button first writes it.

- [ ] **Step 1: Edit `Assets/Templates/NPC.md`**

In the frontmatter block, add an `organizations:` line between the `locations:` block and the `tags:` line. Change:

```yaml
type: npc
locations:
 - <% location? `"[[${location}]]"`: '' %>
tags:
<% tags %>
```

to:

```yaml
type: npc
locations:
 - <% location? `"[[${location}]]"`: '' %>
organizations:
 -
tags:
<% tags %>
```

The lone ` -` matches the vault's empty-list convention (Obsidian normalizes it on save).

- [ ] **Step 2: Edit `Assets/Templates/PLAYER.md`**

In the frontmatter block, add an `organizations:` line after the `subClass:` block and before `cover:`. Change:

```yaml
subClass:
<% subClass.length? yamlList(subClass): ' - ""' %>
cover: "<% portrait %>"
```

to:

```yaml
subClass:
<% subClass.length? yamlList(subClass): ' - ""' %>
organizations:
 -
cover: "<% portrait %>"
```

- [ ] **Step 3: Verify the edits**

```bash
rg -n "^organizations:" Assets/Templates/NPC.md Assets/Templates/PLAYER.md
```

Expected: exactly two matches, one per file.

- [ ] **Step 4: Commit**

```bash
git add Assets/Templates/NPC.md Assets/Templates/PLAYER.md
git commit -m "feat: add empty organizations property to NPC and PC templates"
```

---

### Task 5: Update the `ORGANIZATION.md` template

**Files:**
- Modify: `Assets/Templates/ORGANIZATION.md` (the `> [!column|flex 3]` block)

**Interfaces:**
- Consumes: button `orgMember` (Task 2) via `` `BUTTON[orgMember]` ``; `organizations` property written by Task 3.
- Produces: the template for new org notes — a MEMBERS panel (with button) listing NPCs/PCs whose `organizations` links this org, and an NPC's panel that excludes members.

- [ ] **Step 1: Replace the panels block**

In `Assets/Templates/ORGANIZATION.md`, replace the whole `> [!column|flex 3]` section (currently containing the NPC's, QUESTS, and HISTORY callouts) with the following. The MEMBERS callout is inserted before NPC's; the NPC's base block gains the `not:` member exclusion; QUESTS and HISTORY are unchanged:

```markdown
> [!column|flex 3]
>
> > [!tldr]- MEMBERS
> >
> > `BUTTON[orgMember]`
> >
> > ```base
> > formulas:
> >   Type: |
> >     if(file.inFolder("Compendium/Party/Player Characters"), "PC", "NPC")
> >   Role: |
> >     list(organizations).filter(value.org == this).map(value.role)[0]
> > properties:
> >   file.name:
> >     displayName: Name
> >   formula.Type:
> >     displayName: Type
> >   formula.Role:
> >     displayName: Role
> > views:
> >   - type: table
> >     name: Members
> >     filters:
> >       and:
> >         - or:
> >             - file.inFolder("Compendium/NPC's")
> >             - file.inFolder("Compendium/Party/Player Characters")
> >         - 'list(organizations).map(value.org).contains(this)'
> >     order:
> >       - file.name
> > ```
>
> > [!hint]- NPC's
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
> >         - file.inFolder("Compendium/NPC's")
> >         - file.hasLink(this.file)
> >         - not:
> >             - 'list(organizations).map(value.org).contains(this)'
> > ```
```

Leave the QUESTS and HISTORY callouts exactly as they are after this block.

- [ ] **Step 2: Verify the edit**

```bash
rg -n "BUTTON\[orgMember\]|list\(organizations\)\.map\(value\.org\)\.contains\(this\)" Assets/Templates/ORGANIZATION.md
```

Expected: `BUTTON[orgMember]` once, `list(organizations).map(value.org).contains(this)` twice (once in MEMBERS filter, once in NPC's `not:`).

- [ ] **Step 3: Commit**

```bash
git add Assets/Templates/ORGANIZATION.md
git commit -m "feat: add MEMBERS panel and member-excluding NPC's filter to organization template"
```

---

### Task 6: Backfill the existing organization notes

**Files:**
- Modify: `Compendium/Lore/Organizations/Black Fingers.md`
- Modify: `Compendium/Lore/Organizations/Fellows of Free Fate.md`

**Interfaces:**
- Consumes: same panel content as Task 5.
- Produces: existing org notes behave identically to new ones (MEMBERS panel + button + member-excluding NPC's panel).

Both files have the identical panel section. Note: generated notes use `>> ` (no space after `>>`) inside base code blocks, unlike templates' `> > `. Match each file's existing prefix style exactly.

- [ ] **Step 1: Edit `Compendium/Lore/Organizations/Black Fingers.md`**

Replace the block starting at `> > [!hint]- NPC's` through the closing `>> ```` ``` ```` of its base code block with:

```markdown
> > [!tldr]- MEMBERS
> >
>> `BUTTON[orgMember]`
>>
>> ```base
>> formulas:
>>   Type: |
>>     if(file.inFolder("Compendium/Party/Player Characters"), "PC", "NPC")
>>   Role: |
>>     list(organizations).filter(value.org == this).map(value.role)[0]
>> properties:
>>   file.name:
>>     displayName: Name
>>   formula.Type:
>>     displayName: Type
>>   formula.Role:
>>     displayName: Role
>> views:
>>   - type: table
>>     name: Members
>>     filters:
>>       and:
>>         - or:
>>             - file.inFolder("Compendium/NPC's")
>>             - file.inFolder("Compendium/Party/Player Characters")
>>         - 'list(organizations).map(value.org).contains(this)'
>>     order:
>>       - file.name
>> ```
>
> > [!hint]- NPC's
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
>>         - file.inFolder("Compendium/NPC's")
>>         - file.hasLink(this.file)
>>         - not:
>>             - 'list(organizations).map(value.org).contains(this)'
>> ```
```

- [ ] **Step 2: Edit `Compendium/Lore/Organizations/Fellows of Free Fate.md`**

Apply the identical replacement as Step 1 (same source block, same new block).

- [ ] **Step 3: Verify the edits**

```bash
rg -n "BUTTON\[orgMember\]|not:|list\(organizations\)\.map\(value\.org\)\.contains\(this\)" "Compendium/Lore/Organizations/Black Fingers.md" "Compendium/Lore/Organizations/Fellows of Free Fate.md"
```

Expected: per file — `BUTTON[orgMember]` once, `list(organizations).map(value.org).contains(this)` twice, and `not:` once (in the NPC's filter).

- [ ] **Step 4: Commit**

```bash
git add "Compendium/Lore/Organizations/Black Fingers.md" "Compendium/Lore/Organizations/Fellows of Free Fate.md"
git commit -m "feat: backfill MEMBERS panels and member-excluding NPC's filters on existing org notes"
```

---

### Task 7: Document the convention in AGENTS.md

**Files:**
- Modify: `AGENTS.md` (Conventions to preserve)

**Interfaces:**
- Consumes: nothing.
- Produces: documentation for future maintainers of the `organizations` property, the `orgMember` button, and the `runTemplaterFile` pattern.

- [ ] **Step 1: Add the convention bullet**

In `AGENTS.md`, under **Conventions to preserve**, add this bullet after the existing "Quest status" bullet:

```markdown
- NPC/PC `organizations` is a list of `{ org: "[[Org Name]]", role }` frontmatter objects (role optional). MEMBERS panels filter members with `list(organizations).map(value.org).contains(this)` and derive the per-org role with `list(organizations).filter(value.org == this).map(value.role)[0]`. The `ADD MEMBER` button (`BUTTON[orgMember]`, id `orgMember`) uses a `runTemplaterFile` action (not `templaterCreateNote`) to run `Assets/Templates/ADD_ORG_MEMBER.md`, which appends an org/role entry via `app.fileManager.processFrontMatter`.
```

- [ ] **Step 2: Verify**

```bash
rg -n "orgMember|ADD_ORG_MEMBER" AGENTS.md
```

Expected: at least one match each.

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: document organizations property and orgMember button convention"
```

---

### Task 8: End-to-end manual verification in Obsidian

**Files:** none (validation only)

**Interfaces:**
- Consumes: everything from Tasks 1-7.

No automated checks exist; this feature can only be validated inside Obsidian. Walk the full flow in order:

- [ ] **Step 1: JSON sanity** (already covered per-task, re-run once)

```bash
jq empty .obsidian/plugins/modalforms/data.json .obsidian/plugins/obsidian-meta-bind-plugin/data.json && echo OK
```

Expected: `OK`.

- [ ] **Step 2: Fresh org renders correctly**

Reload Obsidian. Create a new organization via the `org` button on `INDEX.md`. Expected: the note has a `> [!tldr]- MEMBERS` callout with an `ADD MEMBER` button, an `NPC's` callout, and the QUESTS/HISTORY panels. MEMBERS is empty; NPC's is empty.

- [ ] **Step 3: Add an existing NPC as a member**

Click `ADD MEMBER` on the org note, pick an existing NPC, enter a role (e.g. `Captain`), submit. Expected: green notice; the NPC appears in MEMBERS with Type `NPC` and the role; the NPC no longer appears in NPC's.

- [ ] **Step 4: Add a Player Character as a member**

Repeat with an existing PC (role optional). Expected: the PC appears in MEMBERS with Type `PC`.

- [ ] **Step 5: Member note frontmatter shape**

Open the member note's frontmatter. Expected:

```yaml
organizations:
  - org: "[[<Org>]]"
    role: <role>
```

and that a second `ADD MEMBER` for a different org appends a second `{org, role}` entry without touching the first.

- [ ] **Step 6: Duplicate guard**

Click `ADD MEMBER` again and pick the same NPC for the same org. Expected: orange "Already a member" notice, no duplicate entry, MEMBERS still shows one row.

- [ ] **Step 7: Role formula fallback**

If the Role column renders empty or errors, swap the Role formula to the fallback `list(organizations).filter(value.org.contains(this)).map(value.role)[0]` in `Assets/Templates/ORGANIZATION.md` and both existing org notes, then re-verify Step 3-4. (Record which variant worked in the commit message.)

- [ ] **Step 8: Cancellation**

Click `ADD MEMBER` and cancel the form. Expected: the vault-style red "Cancelled: member has not been added" notice, no file changes.

- [ ] **Step 9: Commit any fix-ups**

```bash
git status
```

If Task 7's fallback was applied, commit it:

```bash
git add Assets/Templates/ORGANIZATION.md "Compendium/Lore/Organizations/Black Fingers.md" "Compendium/Lore/Organizations/Fellows of Free Fate.md"
git commit -m "fix: use Role formula variant that evaluates in Bases"
```

Otherwise the working tree should be clean.
