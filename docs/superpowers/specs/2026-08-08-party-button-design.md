# Add "Add Party" Button, Template, and Wiring

Date: 2026-08-08

## Goal

Let the user create party notes from the dashboard. The `PARTY` modal form already
exists (name-only field), so this work wires it up end to end: a `PARTY.md` template,
a Meta Bind button, and a dashboard button.

## Current State

- `PARTY` form exists in `.obsidian/plugins/modalforms/data.json` with a single `Name` field.
- The `QUEST` form's "Assigned to" query already assumes party notes live directly in
  `Compendium/Party/` (`p.file.folder === "Compendium/Party"`).
- No `PARTY.md` template exists.
- No `party` button exists in the Meta Bind plugin config.

## Design

### 1. New template: `Assets/Templates/PARTY.md`

Follows the `PLAYER.md` / `QUEST.md` pattern:

- Open form via `tp.user.utils.openForm('PARTY', 'Party')`; bail on cancel.
- Read `Name`.
- Apply `FasPeopleGroup` icon to `Compendium/Party/<Name>.md`.
- `moveAndOpenFile(tp, name)` (no new path — file stays in `Compendium/Party/`,
  which is already the Meta Bind target folder).
- `notifySuccess("party", name)`.
- Frontmatter: `type: party`, `tags`.
- Body: title + sub2 header, description callout, and dynamic panels:
  - **MEMBERS** — table of `Compendium/Party/Player Characters` where `file.hasLink(this.file)`.
  - **QUESTS** — table of `Compendium/Party/Quests` where `file.hasLink(this.file)`.
  - **HISTORY** — table of `Session Notes` where `file.hasLink(this.file)`.

### 2. Meta Bind button

Add to `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` `buttonTemplates`:

- `id: "party"`, label `ADD PARTY`, `class: "callButton"`, `hidden: true`.
- Action `templaterCreateNote` → `Assets/Templates/PARTY.md`, folder
  `Compendium/Party`, `fileName: "temp"`, `openNote: false`.

### 3. Dashboard button

In `INDEX.md`, add `BUTTON[party]` to The Party callout line, next to
`BUTTON[pc] BUTTON[quest]`.

## Out of Scope

- No change to AGENTS.md frontmatter `type` list (deliberate; `party` type only
  documented if user asks).
- No folder note for `Compendium/Party/` (not requested).

## Verification

Manual, in Obsidian: dashboard → Add Party → modal appears → create → note appears
at `Compendium/Party/<Name>.md` with icon, opens in preview. Also confirm the two
`data.json` files remain valid JSON.
