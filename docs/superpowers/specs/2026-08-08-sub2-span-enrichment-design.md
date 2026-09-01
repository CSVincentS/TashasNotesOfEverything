# Design: Enrich `sub2` spans with new form fields

Date: 2026-08-08

## Purpose

The `sub2` header spans on generated notes currently ignore some of the form fields added/expanded in the recent modal form work. Update four templates so the `sub2` span reflects the newly available data (rank, rarity/magic/cursed status, category/type, assignee) while preserving the existing conditional-segment style (`<% x? \`...\`: '' %>`).

## Changes

All changes are to the `<span class="sub2">` element in `Assets/Templates/*.md`; no logic outside that span changes except reading two new consts in OBJECT.

1. **DEITY** (`Assets/Templates/DEITY.md:34`)
   - Replace the hardcoded `Deity` label with the form's `rank` when present; fall back to `Deity` when empty. Keep the existing conditional `alignment` segment.
   - Final: `:FasCross: <% rank? rank : 'Deity' %><% alignment? \`&nbsp; | &nbsp;:FasYinYang: ${alignment}\`: '' %>`

2. **OBJECT** (`Assets/Templates/OBJECT.md:27`)
   - Add consts `const magical = result.Magical.value;`, `const cursed = result.Cursed.value;`, `const rarity = result.Rarity.value;` (placed in form field order after `type`).
   - Span renders icon + rarity + optional `Cursed` + optional `Magic` + type, space-joined:
     `:${icon}: <% [rarity, cursed && 'Cursed', magical && 'Magic', type].filter(Boolean).join(' ') %>`
   - Example output: `:RiSwordFill: Rare Cursed Magic Weapon`.

3. **ORGANIZATION** (`Assets/Templates/ORGANIZATION.md:29`)
   - Derive label from category/type with this precedence:
     - neither → `Organization`
     - no category, type present → `type`
     - no type, category present → `${category} Organization`
     - both → `${category} ${type}`
   - Final: `:FasSitemap: <% category && type ? \`${category} ${type}\` : type ? type : category ? \`${category} Organization\` : 'Organization' %>`

4. **QUEST** (`Assets/Templates/QUEST.md:36`)
   - Change assignor icon from `:FasUser:` to `:FasHandshakeSimple:`.
   - Append a conditional assignee segment using `:FasUser:`.
   - Final:
     `:FasCircleExclamation: Quest<% status? \` &nbsp; | &nbsp;:FasListCheck: ${status}\`: '' %><% assignor? \` &nbsp; | &nbsp;:FasHandshakeSimple: [[${assignor}]]\`: '' %><% assignee? \` &nbsp; | &nbsp;:FasUser: [[${assignee}]]\`: '' %>`

## Out of scope

- Other templates' `sub2` spans (NPC, EVENT, LANDMARK, LOCALE, CONTINENT, PROVINCE, TERRITORY, REALM, PLANE, NOTE, PLAYER) are unchanged.
- No form config or `utils.js` changes.

## Verification

No automated checks exist. Validate by creating notes in Obsidian: a deity with/without rank, an object with various rarity/magic/cursed combinations, an organization with the four category/type combinations, and a quest with/without assignor and assignee.
