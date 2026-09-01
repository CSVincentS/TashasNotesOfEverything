# Vault Cleanup & Consistency Fixes — Design Spec

Date: 2026-08-05

## Problem

A full review of the vault found issues in four categories:

1. **Dead files / stale references** — an unreachable migration tool, a missing plugin, stale config files, committed sync-conflict backups, and leftover test-junk entries in the icon-folder config.
2. **Broken template defaults** — default banner/portrait paths that point at non-existent files, a wrong-cased icon name, a logic bug that drops subclasses, and two missing `getIcon` mappings.
3. **Template ↔ note inconsistency** — generated notes' tags drifted from what the templates now produce (and vice versa).
4. **Structural violation** — three landmark notes stored flat inside parent folders instead of the documented `Name/Name.md` subfolder pattern.
5. **Doc drift** — AGENTS.md and README are out of date; no `.gitignore` exists; the repo has one commit and AGENTS.md is untracked.

## Decisions (from brainstorming)

1. **Delete the migration tool entirely** — `MIGRATE.md`, the `migrate`/`migrate1` buttons, and the `VaultMigration` form are unreachable (both buttons are `hidden: true` and nothing references them) and buggy. It served its one-time purpose.
2. **Fix templates AND existing notes** — reconcile legacy note content (tags, structural frontmatter) with the templates' current behavior.
3. **Verify then fix the landmark structure** — the convention (AGENTS.md) and the `LANDMARK.md` template both say landmarks live at `<parent>/<name>/<name>.md`; the three flat files violate this.
4. **Full housekeeping** — update AGENTS.md and README, add `.gitignore`, and land everything in one commit.

## Non-goals

- **No rewriting of descriptive content** — prose summaries, `<span class="sub2">` header lines, per-note custom icons (e.g., `LiBeer`, `FasGhost`), and quest descriptions are content, not bugs.
- **No cosmetic whitespace normalization of every existing note** — YAML list indentation varies across legacy notes; we only normalize tag blocks we are already editing for content reasons.
- **No edits to `.obsidian/workspace.json`** — it is volatile user state; its `Assets/Images/header.png` reference is to a file that exists, so it is not broken.
- **Session-note freeform tags stay** — `shopping`, `combatEncounter`, `puzzle` are valid flat tags chosen by the user at creation; the NOTE form accepts them verbatim.
- **Keep `Assets/PDF` and `Assets/Videos` icon-folder entries** — these are intentional pre-provisioned folder icons, not test junk.
- **Do not untrack `.obsidian/icons/`** — the icon packs are part of the shipped vault.

## Changes

### 1. Delete the migration tool

- Delete `Assets/Templates/MIGRATE.md`.
- `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`: remove the `migrate` and `migrate1` entries from `buttonTemplates`.
- `.obsidian/plugins/modalforms/data.json`: remove the `VaultMigration` entry from `formDefinitions`.
- AGENTS.md gotcha bullet that mentions `migrate1`/`MIGRATE 1.md` is removed.

### 2. Remove dead plugin references

- `.obsidian/community-plugins.json`: remove `"quickadd"` (plugin folder does not exist; Obsidian warns on every load). Result must equal the installed plugin folders exactly.
- Delete `.obsidian/text-generator.json` (config for a plugin that is not installed).
- Delete the two committed sync-conflict files:
  - `.obsidian/plugins/obsidian-style-settings/data (conflict 2021-12-13-10-21-38).json`
  - `.obsidian/plugins/obsidian-style-settings/data.sync-conflict-20221001-160841-Q3BSAOD.json`

### 3. Prune stale icon-folder entries

Remove from `.obsidian/plugins/obsidian-icon-folder/data.json` (all point at paths that do not exist; test leftovers):

- `Compendium/Atlas/We in there` and `Compendium/Atlas/We in there/We in there.md`
- `Compendium/Atlas/what` and `Compendium/Atlas/what/what.md`
- `Compendium/Atlas/TEST REALM 2`
- `Compendium/Atlas//asdfadsf` and `Compendium/Atlas//asdfadsf/asdfadsf.md`
- `Compendium/Atlas//qweqweqwe` and `Compendium/Atlas//qweqweqwe/qweqweqwe.md`
- `Compendium/Lore/Objects/secret society.md`
- `Compendium/Lore/Objects/SS.md`
- `Compendium/Lore/Party/Quests/worked baby.md` (path itself is wrong — `Lore/Party` does not exist)

### 4. Fix template bugs

- **NOTE.md**: default banner `"session.jpg"` → `"session.png"` (the actual file).
- **PLAYER.md**: default portrait `"/Assets/Images/Portrait.jpg"` → `"portrait.jpg"` (matches NPC.md's relative, correct-case fallback; the file is `Assets/Images/portrait.jpg`).
- **PLAYER.md**: subclass gating bug — `subClass` is derived from `result.pClass.value?.length`; derive it from `result.subClass.value` instead so a subclass is not dropped when class is empty.
- **NOTE.md**: explorer icon `"LiNoteBookPen"` → `"LiNotebookPen"` (correct Lucide casing, matches the icon-folder config already applied to Session 01/02).
- **utils.js `getIcon`**: add missing OBJECT form types so they stop falling back to `FasQuestion`:
  - `Armor: 'FasUserShield'`
  - `Weapon: 'FasHandFist'`
  - (Both names are already present in the downloaded `.obsidian/icons` pack, so they render even offline.)

### 5. Template consistency fixes

- **REALM.md**: header `<span class="sub2">:RiGlobalLine: Realm (world)</span>` → `:FasGlobe:` to match the folder/note icon the template applies and the existing Toril note.
- **GOD.md**: generate `pantheon/*` tags alongside `domain/*` tags (the form's Pantheon field is currently unused; existing deity notes already carry `pantheon/*` tags, so this aligns template ↔ notes).
- **GOD.md / NOTE.md**: emit tag lines as ` - <tag>` (the documented convention) instead of `- <tag>`.

### 6. Fix existing note tags

- **PC notes** (add the `subclass/*` tags the PLAYER template now generates; normalize each note's tag block to ` - ` format):
  - Alaric Waycrest: `subclass/battleMaster`, `subclass/swashbuckler`
  - Kingston Yashkar: `subclass/conquest`
  - Moira Belkas: `subclass/swarmkeeper`, `subclass/stars`
  - Tilda Rosesong: `subclass/divineSoul`
- **The Scarlet Scourge**: flat `artifact` tag → `object/religiousArtifact` (matches the `object/${toCamelCase(type)}` convention; Type is "Religious Artifact").
- **Sword Coast**: `location/territory` → `location/province` (the note's `type` is `province`; the template emits `location/${toCamelCase(type)}`).

### 7. Restructure landmarks (verified violation)

The convention (`plane → realm → continent/ocean → territory → province → locale → landmark`, each a subfolder + folder note) and the `LANDMARK.md` template (`Compendium/Atlas/<parent>/<name>/<name>.md`) both require subfolders. Move:

- `.../Baldurs Gate/Elfsong Tavern.md` → `.../Baldurs Gate/Elfsong Tavern/Elfsong Tavern.md`
- `.../Baldurs Gate/Sorcerous Sundries.md` → `.../Baldurs Gate/Sorcerous Sundries/Sorcerous Sundries.md`
- `.../Waterdeep/City of the Dead.md` → `.../Waterdeep/City of the Dead/City of the Dead.md`

Wikilinks are name-based (`[[Elfsong Tavern]]`), so links survive the move. Update the icon-folder `data.json` keys to the new note paths and add folder entries for the new folders using the same icon as the note.

### 8. Housekeeping

- **AGENTS.md**: fix "no commits yet" (repo has an initial commit); remove the migration-tool gotcha; note that `docs/superpowers/` now exists; keep the rest accurate.
- **README.md**: add Dataview and Icon Folder to the community-plugins list.
- **`.gitignore`** (new): ignore Obsidian workspace/state and trash:
  - `.obsidian/workspace.json`
  - `.obsidian/workspace-mobile.json`
  - `.trash/`
- **Commit** everything (including the now-tracked AGENTS.md) in one commit per user preference.

## Verification

No automated test tooling exists. Verification is scripted:

1. All touched JSON files parse (`python3 -m json.tool` or `json.load`).
2. `community-plugins.json` plugin list exactly matches the `.obsidian/plugins/` folder names.
3. No remaining references to `MIGRATE`, `MIGRATE 1`, `quickadd`, or `text-generator` anywhere.
4. Every key in `obsidian-icon-folder/data.json` (except `settings`) resolves to an existing file/folder, and every Atlas location icon key uses a valid single-slash path.
5. All `[[wikilink]]` targets resolve to a note by basename (name-based check).
6. The four PC notes, Scarlet Scourge, and Sword Coast carry the corrected tags.
7. The three landmarks live at `<parent>/<name>/<name>.md`.

## Risks

- Moving files outside Obsidian bypasses `alwaysUpdateLinks`; safe here because wikilinks are name-based. Confirmed no path-based references exist outside icon-folder config.
- Editing plugin `data.json` files while Obsidian is closed is required; if Obsidian is running, changes may be overwritten. The operator must close Obsidian first.
