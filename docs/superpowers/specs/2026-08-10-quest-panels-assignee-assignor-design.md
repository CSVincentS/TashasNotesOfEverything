# Quest panels: filter by assignee/assignor

Date: 2026-08-10

## Problem

The QUESTS panels on generated notes (PCs, parties, NPCs, organizations) filter quests with `file.hasLink(this.file)`, which matches *any* backlink to the note — not just quests actually assigned to/from that entity. For a quest that merely mentions an NPC, the panel shows it even though the NPC didn't give or take the quest.

Quests carry `assignor` (who gave the quest) and `assignee` (who takes it) in frontmatter. The panels should filter on those instead of raw backlinks.

## Change

Replace the quest-panel filter `file.hasLink(this.file)` with a property-aware filter using the Bases link-property pattern (`list()` normalizes scalar-vs-list; `this` is the note embedding the base; string comparison against `this.file.name` would fail on link-typed values):

- **Assignee panels** (`PLAYER.md`, `PARTY.md` and their generated notes): `'list(assignee).contains(this)'`
- **Assignor panels** (`NPC.md`, `ORGANIZATION.md` and their generated notes): `'list(assignor).contains(this)'`

The folder filter `file.inFolder("Compendium/Party/Quests")` is unchanged, as is the `order` block where present (NPC.md and its generated notes keep `order: - file.name`).

### Templates (4 files)

- `Assets/Templates/PLAYER.md` — QUESTS panel filter → assignee
- `Assets/Templates/PARTY.md` — QUESTS panel filter → assignee
- `Assets/Templates/NPC.md` — QUESTS panel filter → assignor
- `Assets/Templates/ORGANIZATION.md` — add a `> [!info]- QUESTS` panel (filter → assignor) between the NPC's and HISTORY panels; existing NPC's and HISTORY panels unchanged

### Existing generated notes

Same filter change applied to the quest panels of notes generated before this change. Only the quest-panel filter (or adding a missing quest panel) changes — HISTORY, MEMBERS, and NPC's panels are untouched, and existing panel names/callout styles are preserved:

- PCs (assignee): `Alaric Waycrest.md`, `Kingston Yashkar.md`, `Moira Belkas.md`, `Tilda Rosesong.md`
- Party (assignee): add QUESTS panel to `LASTSTAND.md`
- NPCs (assignor): `Tinkera Drenn.md`, `Rythe Sterling.md`, `Eleidin Verlice.md`, `Paloma Beltre.md`
- Organizations (assignor): add QUESTS panels to `Black Fingers.md`, `Fellows of Free Fate.md`

### Data backfill (3 quests)

Existing quests use the legacy `target:` property and lack both `assignor` and `assignee`. Convert `target` → `assignee` and add `assignor` where documented:

| Quest | assignee | assignor |
| --- | --- | --- |
| Double Trouble | `"[[Alaric Waycrest]]"` (from `target`) | (empty) |
| Take Five | `"[[LASTSTAND]]"` (`target: groupQuest` → party) | (empty) |
| The Delivery | `"[[LASTSTAND]]"` (`target: groupQuest` → party) | `"[[Tinkera Drenn]]"` (per note body) |

`target` has no consumers elsewhere in the vault, so it is replaced (not kept). Empty `assignor` renders as an empty property, matching how the QUEST template emits a missing assignor.

## Out of scope

- The HISTORY panels (still `file.hasLink`) — session notes legitimately link across, unchanged.
- The NPC's panels on organization/party notes (still `file.hasLink`) — unchanged.
- Regenerating any note from its template; generated notes are edited in place.

## Verification

- No automated checks exist. Manual validation in Obsidian: open Alaric Waycrest (should list Double Trouble), LASTSTAND (should list Take Five and The Delivery), and Tinkera Drenn (should list The Delivery) and confirm each shows the correct quests.
- Keep both `data.json` plugin files untouched (no form/button changes).
