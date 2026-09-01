# Clean-Start Tasha's Vault Setup — Design Spec

Date: 2026-08-06

## Problem

The user wants a fresh, empty Obsidian vault with the same automation and look as this
vault ("Tasha's Notes of Everything"), set up from scratch. The current vault has been
through multiple migrations and carries cruft; the user wants a clean start and wants to
install and configure the plugins themselves rather than inherit the existing state.

## Decisions (from brainstorming)

1. **Approach A — scaffolded vault + plugin-setup guide.** Static files that cannot be
   authored in a GUI are generated as a new vault skeleton; everything plugin-related is
   left to the user, who is walked through install/config by a written guide.
2. **Faithful copy of structure.** Folder names, file names, button IDs, form names,
   template names, `utils.js` signatures, and `INDEX.md` match the current vault exactly so
   existing docs (AGENTS.md, plans, specs) remain accurate and content can later be moved in.
3. **Empty content.** The new vault contains only machinery: folder skeleton, templates,
   `utils.js`, `INDEX.md`, CSS snippets, and docs. No sample notes, images, or lore.
4. **Scaffold location.** Created at `clean-vault/` inside this repo first; the user moves
   it elsewhere later. The parent `.gitignore` gains `clean-vault/` so the scaffold is not
   committed to this repo.
5. **Plugin binaries/configs are NOT scaffolded.** No `.obsidian/plugins/`,
   `.obsidian/themes/`, or `.obsidian/icons/` are created. The user installs all 7 community
   plugins and the Prism theme via Obsidian's GUI and sets every setting themselves per the
   guide. The two JSON-heavy plugins (Meta Bind, Modal Forms) include their current
   `data.json` as an appendix for an exact-match fallback.
6. **Theme/icons not copied.** The Prism theme is installed by the user from the community
   theme browser; the `.obsidian/icons/` icon set is intentionally NOT copied (the user
   configures Icon Folder via the guide, and icons are applied per-folder/per-note by the
   automation at creation time).

## Deliverables

1. **Vault skeleton** at `clean-vault/`:
   - `Session Notes/` (empty)
   - `Compendium/NPC's/` (empty)
   - `Compendium/Party/Player Characters/`, `Compendium/Party/Quests/` (empty)
   - `Compendium/Lore/Deities/`, `Compendium/Lore/Events/`, `Compendium/Lore/Objects/`,
     `Compendium/Lore/Organizations/` (empty)
   - `Compendium/Atlas/` (empty; subfolders created dynamically by location templates)
   - `Assets/Templates/` — all 16 templates + `utils.js`, copied verbatim from the current
     vault: `CONTINENT.md`, `EVENT.md`, `GOD.md`, `LANDMARK.md`, `LOCALE.md`, `NOTE.md`,
     `NPC.md`, `OBJECT.md`, `ORGANIZATION.md`, `PLANE.md`, `PLAYER.md`, `PROVINCE.md`,
     `QUEST.md`, `REALM.md`, `STARTUP.md`, `TERRITORY.md`, `utils.js`
   - `Assets/Images/` (empty; category folders auto-created on upload)
   - `.obsidian/snippets/` — the 12 CSS files, verbatim: `Buttons.css`, `Callouts.css`,
     `Cards.css`, `Columns.css`, `Embed Adjustments.css`, `Image Adjustments.css`,
     `Lists.css`, `Modal Form.css`, `NPC Toggle.css`, `Popup.css`, `Prism Theme Edits.css`,
     `Tables.css`
   - `INDEX.md` — copied verbatim (Bases panels + `BUTTON[...]` rows)
   - `AGENTS.md` — copied verbatim
   - `README.md` — copied verbatim
   - `.gitignore` — standard Obsidian workspace exclusions
2. **Guide** at repo root `CLEAN-VAULT-SETUP.md` (stays behind after the vault is moved).
   Ordered walkthrough:
   1. Open `clean-vault/` as a new vault in Obsidian.
   2. Install **Prism** theme via *Settings → Appearance → Community themes*.
   3. Enable the 12 CSS snippets in *Settings → Appearance → CSS snippets*.
   4. Install + enable each community plugin, with exact settings:
      - **Templater** — templates folder `Assets/Templates`; user scripts folder
        `Assets/Templates`; startup template `Assets/Templates/STARTUP.md`; trigger-on-file-
        creation off; enable folder templates on (with empty pairs, matching current config).
      - **Folder Notes** — settings mirroring the current `data.json`.
      - **Icon Folder** — which folders get which icons, mirroring the current config.
      - **Style Settings** — the toggles that matter for the Prism + snippet look.
      - **Dataview** — enabled; no real configuration required (used by forms and queries).
      - **Meta Bind** — add the 15 button templates, each a `templaterCreateNote` action
        pointing at the matching template + folder (`npc`, `pc`, `quest`, `note`, `plane`,
        `realm`, `continent`, `territory`, `province`, `locale`, `landmark`, `deity`,
        `event`, `object`, `org`). Full settings listed; current `data.json` included as an
        appendix for exact paste.
      - **Modal Forms** — define the forms each template opens (form names = the names each
        template passes to `MF.openForm(...)`, e.g. `NPC`, `PLAYER`, `QUEST`, ...). Full
        field definitions listed; current `data.json` included as an appendix.
   5. **Verification checklist**: click each button in `INDEX.md`; confirm the form opens,
      the note is created/renamed/moved, the icon is applied, and the Bases panels render;
      create a session note and confirm `Session 01` auto-numbering; confirm `STARTUP.md`
      runs on vault open and re-renders icons.
3. **Parent `.gitignore` update** — add `clean-vault/`.

## Non-goals

- **No content creation** — no sample NPCs, sessions, locations, lore, or images.
- **No plugin binaries** — `.obsidian/plugins/`, `.obsidian/themes/`, and `.obsidian/icons/`
  are intentionally absent; the user installs/enables everything via the GUI.
- **No structural changes** — the new vault replicates the current structure faithfully,
  including the `Compendium/NPC's` apostrophe and the Atlas subfolder pattern.
- **No changes to the existing vault's behavior** — templates, `utils.js`, `INDEX.md`, and
  snippets are copied verbatim, not rewritten.
- **No commits of the scaffold** — `clean-vault/` is gitignored here; the user may `git init`
  when they move it out.

## Verification

No automated checks exist. Success criteria (manual, in Obsidian):

- Opening `clean-vault/` shows a working dashboard with all five callout sections and buttons.
- Each of the 15 buttons opens its form and creates the correct note type in the correct
  folder, with the correct icon, and the file is renamed from `temp`.
- Atlas hierarchy templates build `Compendium/Atlas/<parent>/<Name>/<Name>.md` subfolders.
- Session notes auto-number as `Session NN`.
- The Prism theme + 12 snippets render as expected in preview mode.
