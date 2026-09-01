# Design: Expand `getIcon` Type Mappings

Date: 2026-08-08

## Purpose

`getIcon(type)` in `Assets/Scripts/utils.js` maps a form-selected type (item type, building type, event type) to an icon code used on generated notes/folders. The recent modal form expansion added many new option values, so the icon map must cover them and reconcile conflicts.

## Changes

1. **Add entries** for all new types from the three tables:
   - Item types: Clothing, Relic, Potion, Scroll, Poison
   - Building types: Academy, Alchemist, Apothecary, Arena, Armory, Bank, Barracks, Bathhouse, Bazaar, Bookstore, Brothel, Butcher, Carpenter, Cartographer, Castle, Cemetery, Chapel, Church, Cobbler, Coliseum, Cooperage, Courier, Court, Dockhouse, Dyer, Embassy, Exorcist, Fletcher, Gallow, Garden, Garrison, Gatehouse, Herbalist, Hospital, Jail, Jeweler, Locksmith, Monastery, Morgue, Orphanage, Plaza, Potter, Brewery, Shrine, Stonemason, Tailor, Theater, Tower, Warehouse, Well
   - Event types: Social, Cultural, Mystical, Economic, Military, Criminal, Discovery, Natural, Environmental, Cosmic → all `FasCircleQuestion`
2. **Overwrite conflicting entries** with table values:
   - Weapon: `FasHandFist` → `RiSwordFill`
   - Armor: `FasUserShield` → `FasShield`
   - Tavern: `RiBeerLine` → `RiBeerFill`
3. **Change the catch-all fallback** from `'FasQuestion'` to `'FasCircleQuestion'`.

All non-conflicting existing entries (Blacksmith, Camp, Inn, Jewelry, Library, Market, Personal, Political, Port, Religious, Religious Artifact, Residence, Seasonal, Shop, Stable, Temple, etc.) remain unchanged.

## Scope / Out of scope

In scope: single-file change to `getIcon`'s `iconMappings` and its fallback. Out of scope: template edits, form config, icon-folder plugin config — templates already call `getIcon(type)` and consume the returned icon.

## Verification

No automated checks exist. Validate by creating an item, a building-type locale, and each new event type in Obsidian and confirming the expected icon renders on the note and folder.
