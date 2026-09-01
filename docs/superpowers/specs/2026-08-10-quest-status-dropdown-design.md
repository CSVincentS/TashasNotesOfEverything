# Quest Status Dropdown on Quest Notes

Date: 2026-08-10

## Goal

Turn quest status into an editable dropdown on quest notes. Today status only
exists as a `quest/<state>` tag that the "Add Quest" form stamps in and the
dashboard (INDEX.md) parses; there is no way to change it from the note itself.
This work adds a dedicated `status` frontmatter property bound to a Meta Bind
`inlineSelect` in the quest subtitle, making status a single source of truth.

## Current State

- The `QUEST` modal form offers `Abandoned`, `Completed`, `Failed`, `Ongoing`,
  `Pending` (dataview field `['Abandoned','Completed','Failed','Ongoing','Pending']`).
- `Assets/Templates/QUEST.md` turns the form value into a `quest/<camelCase>`
  tag; that tag is the only tag a quest note gets.
- The quest subtitle shows a static status label: `:FasListCheck: Ongoing`.
- `INDEX.md` Quests callout reads status from tags via Bases formulas:
  `list(file.tags).map(value.replace("#quest/", ""))` (and a `StatusCard`
  variant wrapped in parens).
- Existing quest notes: The Delivery (`quest/ongoing`), Double Trouble
  (`quest/pending`), Take Five (`quest/completed`).
- Meta Bind `inlineSelect` is inline-allowed and binds to frontmatter
  properties (tags are not bindable). `select` is code-block-only.

## Design

### 1. Status property + inline dropdown

- Add `status: quest/<state>` to quest frontmatter (`pending | ongoing |
  completed | failed | abandoned`, camelCase, matching the current tag style).
  This becomes the single source of truth.
- Remove the `quest/<state>` tag from `tags` (tags then renders as the lone ` -`).
- Replace the static status label in the `<span class="sub2">` subtitle with a
  Meta Bind `inlineSelect` bound to `status`, so the dropdown doubles as the
  status chip:
  ```
  INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]
  ```
  Option values are single-quoted strings (robust against parser edge cases);
  the label shown in the dropdown is the Title Case name.

### 2. `Assets/Templates/QUEST.md`

- Frontmatter: add `status: <% status ? `quest/${toCamelCase(status)}` : 'quest/pending' %>`.
- Drop the status-tag construction (`const tags = [...]`); emit an empty tags
  list (` -`), per the vault's empty-list convention.
- Subtitle: `:FasListCheck:` icon followed by the `inlineSelect` INPUT instead
  of the static `<% status %>` text.

### 3. Dashboard formulas (`INDEX.md`)

- `StatusCard` and `Status` formulas switch from parsing `file.tags` to reading
  `file.status`, e.g.:
  - `Status: file.status ? file.status.replace("quest/", "") : "pending"`
  - `StatusCard: "(" + (file.status ? file.status.replace("quest/", "") : "pending") + ")"`
- Display on the Quests cards/list is unchanged.

### 4. Migrate existing quest notes

For each of the three existing quest notes (The Delivery, Double Trouble, Take
Five):

- Add the matching `status:` property (`quest/ongoing`, `quest/pending`,
  `quest/completed`).
- Remove the now-stale `quest/<state>` tag from `tags`.
- Replace the subtitle status label with the same `inlineSelect` INPUT.

### 5. Documentation (`AGENTS.md`)

- Update the hierarchical-tag convention example so `quest/ongoing` no longer
  reads as a tag on quest notes.
- Add a note: quest status lives in the `status` frontmatter property (value
  `quest/<state>`), rendered as an `inlineSelect` dropdown in the quest
  subtitle; the dashboard reads `file.status`, not tags.

## Out of Scope

- No change to the `QUEST` modal form's status choices (kept in sync
  deliberately — the dropdown and form share the vocabulary).
- No change to the `quest/giver` NPC tag or session-note tags like
  `quest/accepted`/`quest/completed`.
- No STARTUP.md change (template-driven creation covers new quests; migration
  covers existing ones).

## Verification

Manual, in Obsidian (no automated checks exist in this vault):

1. Dashboard → Add Quest → create a quest with a status; confirm the note has a
   `status` property and no `quest/*` tag, and the subtitle shows a dropdown at
   the selected state.
2. Flip the dropdown; confirm the frontmatter `status` updates and the
   dashboard card/list shows the new state.
3. Create a quest leaving Status blank; confirm it defaults to `quest/pending`.
4. Open the three migrated notes; confirm each dropdown shows its current state
   and the dashboard reflects it.
