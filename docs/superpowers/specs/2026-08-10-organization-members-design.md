# Organization members: add-member button and MEMBERS panel

Date: 2026-08-10

## Problem

An organization note's NPC's panel lists NPCs whose note links to the org (`file.hasLink(this.file)`), and there is no way to record actual membership — adding a member requires hand-editing each NPC/PC note to add a link, and there is no place to record a member's role within the org. The user wants a button on the organization note that links an existing NPC or Player Character to the org (with an optional role), without editing in source mode.

## Data model

NPC and PC notes gain an `organizations` frontmatter property: a list of objects pairing the org link with the member's role in that org.

```yaml
organizations:
  - org: "[[Black Fingers]]"
    role: Captain
  - org: "[[Harpers]]"
    role: Treasurer
```

- Each org/role pair lives together, so hand-editing one entry cannot desync roles from orgs (unlike parallel lists).
- `org` is an inline link; `role` is a free-text string, optional.
- Notes with no memberships have an empty `organizations:` list. Absent on legacy notes, `list(organizations)` normalizes to empty, so queries are safe.

## Add-member flow (button → form → script)

1. A Meta Bind button `ADD MEMBER` on the organization note (id `orgMember`) uses the `runTemplaterFile` action to run `Assets/Templates/ADD_ORG_MEMBER.md` in the context of the current (org) note.
2. That template reads the org name from `tp.file.basename`, opens a new Modal Form (`ORG_MEMBER`), and on submit appends `{ org: "[[Org]]", role }` to the chosen member's `organizations` via `app.fileManager.processFrontMatter`.
3. If the member already belongs to the org, the script skips the write and shows a notice. Success/cancel feedback uses the existing `openForm` / `notifySuccess` helpers.

### Form `ORG_MEMBER` (modalforms `data.json`)

- `Member` — dataview, required: `[...dv.pages('"Compendium/NPC\'s"').file.name, ...dv.pages('"Compendium/Party/Player Characters"').file.name]`
- `Role` — text, optional

### Template `ADD_ORG_MEMBER.md` (JS-only, no body output)

- Resolve the member file by name from the two member folders (`Compendium/NPC's/` and `Compendium/Party/Player Characters/`); if a name exists in both, the first match wins (name collisions are rare and not otherwise handled).
- `processFrontMatter`: if `organizations` already contains an entry whose `org` matches `[[Org]]`, notify "already a member" and do nothing; otherwise push the `{ org, role }` object (omit `role` when blank).

### Button (meta-bind `data.json`)

New hidden button template, matching the existing style (class `callButton`):

- id `orgMember`, label `ADD MEMBER`
- action `{ "type": "runTemplaterFile", "templateFile": "Assets/Templates/ADD_ORG_MEMBER.md" }`

## Panels on the organization note

### MEMBERS panel (new, `> [!tldr]- MEMBERS`, same style as PARTY)

Contains `BUTTON[orgMember]` and a Bases table. Members are NPCs or Player Characters whose `organizations` has an entry linking to this org:

```yaml
filters:
  and:
    - or:
        - file.inFolder("Compendium/NPC's")
        - file.inFolder("Compendium/Party/Player Characters")
    - 'list(organizations).map(value.org).contains(this)'
```

Columns:

```yaml
formulas:
  Type: |
    if(file.inFolder("Compendium/Party/Player Characters"), "PC", "NPC")
  Role: |
    list(organizations).filter(value.org == this).map(value.role)[0]
properties:
  file.name:
    displayName: Name
  formula.Type:
    displayName: Type
  formula.Role:
    displayName: Role
```

### NPC's panel (updated)

The existing `> [!hint]- NPC's` panel keeps its `file.inFolder("Compendium/NPC's")` + `file.hasLink(this.file)` filters, plus an exclusion so members don't appear in both:

```yaml
- file.inFolder("Compendium/NPC's")
- file.hasLink(this.file)
- not:
    - 'list(organizations).map(value.org).contains(this)'
```

HISTORY and QUESTS panels are unchanged.

## Templates

- `Assets/Templates/ORGANIZATION.md` — add MEMBERS callout + button; update NPC's panel filter; no other changes.
- `Assets/Templates/NPC.md` — add empty `organizations:` frontmatter property.
- `Assets/Templates/PLAYER.md` — add empty `organizations:` frontmatter property.
- `Assets/Templates/ADD_ORG_MEMBER.md` — new (the linking script).

## Existing generated notes

- Add the MEMBERS panel + button and update the NPC's panel filter in the two existing org notes: `Compendium/Lore/Organizations/Black Fingers.md`, `Compendium/Lore/Organizations/Fellows of Free Fate.md`. HISTORY/QUESTS panels and existing names/styles preserved.
- NPC and PC notes are not backfilled (absent `organizations` is safe); members are added via the button going forward.

## Documentation

- Update `AGENTS.md` to document the `organizations` property convention (list of `{org, role}` objects) and the `orgMember` button / `runTemplaterFile` pattern.

## Out of scope

- Creating new NPCs/PCs from the org note (the button links existing notes only; new characters use the existing NPC/PC buttons on INDEX).
- Removing members (manual frontmatter edit, as with other relationships).
- Changing the HISTORY or QUESTS panels.
- Refactoring how quests record assignor/assignee.

## Verification

No automated checks exist. Manual validation in Obsidian:

1. Create a fresh organization via the org button — MEMBERS callout and `ADD MEMBER` button render; NPC's panel shows no members.
2. Click `ADD MEMBER`, pick an existing NPC with a role; confirm the NPC appears in MEMBERS with Type/ Role and disappears from NPC's.
3. Add a PC the same way; confirm it appears in MEMBERS with Type "PC".
4. Add the same NPC again; confirm "already a member" notice and no duplicate.
5. Confirm `organizations` frontmatter shape on the member note matches the design.
6. If `value.org == this` in the Role formula fails to evaluate, fall back to `value.org.contains(this)` or compare against `link(this)`; verify the Role column renders.
7. Keep both plugin `data.json` files valid JSON; keep button id / template file / form name in sync.
