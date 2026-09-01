# getIcon Type Mappings Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand `getIcon`'s `iconMappings` to cover the new item, building, and event types added in the modal form expansion, overwrite three conflicting mappings, and change the fallback icon.

**Architecture:** Single-file edit to `Assets/Scripts/utils.js`. The `getIcon(type)` function returns an icon name from a flat `iconMappings` object; templates and `applyIcon` already consume the return value unchanged, so no other files change.

**Tech Stack:** JavaScript (Templater user script), Obsidian icon-folder plugin icon names.

## Global Constraints

- Icon names must match the tables in the spec exactly (e.g. `FasCircleQuestion`, not `FasQuestion`).
- Keys must be exact strings (capitalization matters), e.g. `'Religious Artifact'` keeps its space and quotes.
- Do not touch templates, form config, or icon-folder plugin config.
- Fallback changes from `'FasQuestion'` to `'FasCircleQuestion'`.

---
### Task 1: Update `getIcon` mappings in utils.js

**Files:**
- Modify: `Assets/Scripts/utils.js:48-95`

**Interfaces:**
- Consumes: existing `getIcon(type)` signature (string → string).
- Produces: updated `getIcon` returning the new icon name for every mapped type, `'FasCircleQuestion'` for unmapped types.

- [ ] **Step 1: Read the current `getIcon` implementation**

Read `Assets/Scripts/utils.js:48-95` to confirm the current `iconMappings` object and its fallback line.

- [ ] **Step 2: Add and overwrite icon mappings**

Edit the `iconMappings` object inside `getIcon` so it contains exactly the following entries (existing non-conflicting entries stay). The full object after editing:

```js
    getIcon: (type) => {
        const iconMappings = {
            Academy: 'FasSchool',
            Alchemist: 'FasLeaf',
            Apothecary: 'FasFlaskVial',
            Arena: 'RiSwordFill',
            Armor: 'FasShield',
            Armory: 'FasHammer',
            Bank: 'RiBankFill',
            Barracks: 'LiCastle',
            Bathhouse: 'FasBath',
            Bazaar: 'FasCartShopping',
            Blacksmith: 'FasHammer',
            Bookstore: 'FasBook',
            Brewery: 'RiDrinksFill',
            Brothel: 'FasVenusMars',
            Butcher: 'bone',
            Camp: 'FasCampground',
            Carpenter: 'FasHammer',
            Cartographer: 'FasMap',
            Castle: 'LiCastle',
            Cave: 'FasMound',
            Cemetery: 'FasGhost',
            Chapel: 'FasChurch',
            Church: 'FasChurch',
            City: 'FasCity',
            Clothing: 'FasShirt',
            Cobbler: 'FasShoePrints',
            Coliseum: 'RiSwordFill',
            Continent: 'FasEarthAmericas',
            Cooperage: 'FasBucket',
            Cosmic: 'FasCircleQuestion',
            Courier: 'RiMailFill',
            County: 'FasLandmark',
            Country: 'FasFlag',
            Court: 'FasHammer',
            Criminal: 'FasCircleQuestion',
            Cultural: 'FasCircleQuestion',
            Desert: 'FasSun',
            Discovery: 'FasCircleQuestion',
            Dockhouse: 'FasSailboat',
            Dyer: 'FasShirt',
            Economic: 'FasCircleQuestion',
            Embassy: 'FasSchoolFlag',
            Encampment: 'FasTowerObservation',
            Environmental: 'FasCircleQuestion',
            Exorcist: 'FasGhost',
            Fletcher: 'RiFlowerFill',
            Forest: 'FasTree',
            Gallow: 'RiCriminalFill',
            Garden: 'RiFlowerFill',
            Garrison: 'RiSwordFill',
            Gatehouse: 'FasHouseLock',
            'General Region': 'FasMap',
            Guildhall: 'FasShield',
            Herbalist: 'FasLeaf',
            Hospital: 'FasHospital',
            Inn: 'FasBed',
            Jail: 'RiCriminalFill',
            Jeweler: 'FasGem',
            Jewelry: 'FasGem',
            Kingdom: 'FasChessRook',
            Lake: 'FasWater',
            Library: 'FasBookOpen',
            Locksmith: 'FasLock',
            Market: 'FasScaleUnbalanced',
            Military: 'FasCircleQuestion',
            Monastery: 'FasChurch',
            Morgue: 'FasSkull',
            Mountain: 'FasMountain',
            Mystical: 'FasCircleQuestion',
            Nation: 'FasFlag',
            Natural: 'FasCircleQuestion',
            Ocean: 'FasWater',
            Orphanage: 'FasChild',
            Personal: 'FasCalendarDays',
            Plains: 'FasWheatAwn',
            Plaza: 'FasHandshakeSimple',
            Poison: 'FasBiohazard',
            Political: 'FasBullhorn',
            Port: 'FasSailboat',
            Potion: 'FasPrescriptionBottleMedical',
            Potter: 'FasHammer',
            Province: 'FasLandmark',
            'Quest Item': 'FasScroll',
            Relic: 'FasBookOpen',
            Religious: 'FasCross',
            'Religious Artifact': 'FasCross',
            Residence: 'FasHouse',
            Scroll: 'FasScroll',
            Seasonal: 'RiSunFoggyFill',
            Shop: 'FasCartShopping',
            Shrine: 'FasChurch',
            Social: 'FasCircleQuestion',
            Stable: 'FasHorseHead',
            State: 'FasLandmark',
            Stonemason: 'FasHammer',
            Swamp: 'FasSmog',
            Tailor: 'FasShirt',
            Tavern: 'RiBeerFill',
            Temple: 'FasChurch',
            Theater: 'FasMasksTheater',
            Tower: 'FasTowerObservation',
            Town: 'RiBuilding4Fill',
            Treasure: 'RiVipDiamondFill',
            Village: 'FasTents',
            Warehouse: 'FasWarehouse',
            Weapon: 'RiSwordFill',
            Well: 'FasBucket'
        };
        return iconMappings[type] || 'FasCircleQuestion';
    },
```

Note the three overwrites (Weapon, Armor, Tavern) and the ten event types explicitly mapped to `FasCircleQuestion`.

- [ ] **Step 3: Change the fallback**

Replace the final `return iconMappings[type] || 'FasQuestion';` with `return iconMappings[type] || 'FasCircleQuestion';` (already included in Step 2's snippet — skip if done).

- [ ] **Step 4: Validate JSON-safe syntax**

Run: `node --check Assets/Scripts/utils.js`

Expected: no output (file parses without syntax errors).

- [ ] **Step 5: Verify a sample of mappings**

Run the following to confirm the object evaluates cleanly and spot-check keys:

```bash
node -e "
const fs = require('fs');
const src = fs.readFileSync('Assets/Scripts/utils.js','utf8');
const key = 'iconMappings = {';
const start = src.indexOf(key) + key.length - 1;
const objEnd = src.indexOf('};', start);
const objText = src.slice(start, objEnd + 1);
const iconMappings = new Function('return ' + objText)();
for (const t of ['Weapon','Armor','Tavern','Clothing','Relic','Potion','Scroll','Poison','Academy','Theater','Cosmic','Social','Well']) {
  console.log(t, '=>', iconMappings[t]);
}
console.log('Total keys:', Object.keys(iconMappings).length);
"
```

Expected output: `Weapon => RiSwordFill`, `Armor => FasShield`, `Tavern => RiBeerFill`, and a defined (non-`undefined`) icon for every other sampled key.

If `node --check` passes and the sampled keys match the spec's tables, manual visual confirmation in Obsidian is the final gate.

- [ ] **Step 6: Commit**

```bash
git add Assets/Scripts/utils.js
git commit -m "feat: expand getIcon mappings for item, building, and event types"
```
