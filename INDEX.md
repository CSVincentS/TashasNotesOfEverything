---
cssClasses: index
---

![[Assets/Images/Placeholder/compendium.jpg|banner]]

###### <span class="head">Campaign Journal</span>

```base
formulas:
  Details: |
        [icon("crown"), level, "\u00A0 | \u00A0", icon("user"), race, "\u00A0 | \u00A0", icon("swords"), if(class.isType("list"), list(class).join(" / "), class)]
views:
  - type: cards
    name: Cards
    filters:
      and:
        - file.inFolder("Compendium/Party/Player Characters")
    order:
      - file.name
      - formula.Details
    image: note.cover
    imageAspectRatio: 1.15
    imageFit: ""
    cardSize: 250
```

> [!session]- Session Notes<br><span class="sub">Summaries & Notes</span>
>
> ```base
> formulas:
>   Date: |
>    list(date)
>      .map("(" + value + ")")
>
> properties:
>   file.name:
>     displayName: Name
>     
> views:
>   - type: cards
>     name: Cards
>     filters:
>       and:
>         - file.inFolder("Session Notes")
>     order:
>       - file.name
>       - formula.Date
>     
>   - type: table
>     name: List
>     filters:
>       and:
>         - file.inFolder("Session Notes")
>     order:
>       - file.name
>       - date
> ```
> ---
>
> `BUTTON[note]`

> [!party]- The Party<br><span class="sub">Party & Players</span>
>
> ```base
> formulas:
>   Type: |
>    list(type)
>      .map("(" + value + ")")
>
> properties:
>   file.name:
>     displayName: Name
>
> views:
>   - type: cards
>     name: Cards
>     filters:
>       and:
>         - file.inFolder("Compendium/Party")
>         - not:
>             - file.inFolder("Compendium/Party/Quests")
>     order:
>       - file.name
>       - formula.Type
>     sort:
>       - column: type
>         direction: ASC
>       - column: file.name
>         direction: ASC
>
>   - type: table
>     name: List
>     filters:
>       and:
>         - file.inFolder("Compendium/Party")
>         - not:
>             - file.inFolder("Compendium/Party/Quests")
>     order:
>       - file.name
>       - type
>     sort:
>       - column: type
>         direction: ASC
>       - column: file.name
>         direction: ASC
> ```
> ---
>
> `BUTTON[party]` `BUTTON[pc]`

> [!agenda]- Quests<br><span class="sub">Current & Past Quests</span>
>
> ```base
> formulas:
>   StatusCard: |
>    "(" + if(status, status.replace("quest/", ""), "pending") + ")"
>   Status: |
>    if(status, status.replace("quest/", ""), "pending")
> 
> properties:
>   file.name:
>     displayName: Name
>     
> views:
>   - type: cards
>     name: Cards
>     filters:
>       and:
>         - file.inFolder("Compendium/Party/Quests")
>     order:
>       - file.name
>       - formula.StatusCard
>
>   - type: table
>     name: List
>     filters:
>       and:
>         - file.inFolder("Compendium/Party/Quests")
>     order:
>       - file.name
>       - formula.Status
> ```
> ---
>
> `BUTTON[quest]`

> [!npc]- NPC's<br><span class="sub">Non-Player Characters</span>
>
> ```base
> formulas:
>   RaceCard: |
>    list(file.tags)
>      .filter(value.startsWith("#race"))
>      .map(
>        "(" + value
>          .replace("#race/", "")
>          .replace("half", "half ")
>          .replace("yuanTi", "yuan ti ")
>         .replace("simic", "simic ")
>          .lower() + ")"
>      )
>   Race: |
>    list(file.tags)
>      .filter(value.startsWith("#race"))
>      .map(
>        value
>          .replace("#race/", "")
>          .replace("half", "half ")
>          .replace("yuanTi", "yuan ti ")
>         .replace("simic", "simic ")
>          .lower()
>      )
>
> properties:
>   file.name:
>     displayName: Name
>     
> views:
>   - type: cards
>     name: Cards
>     filters:
>       and:
>         - file.inFolder("Compendium/NPC's")
>     order:
>       - file.name
>       - formula.RaceCard
>
>   - type: table
>     name: List
>     filters:
>       and:
>         - file.inFolder("Compendium/NPC's")
>     order:
>       - file.name
>       - formula.Race
> ```
> ---
>
> `BUTTON[npc]`

> [!genloc]- Atlas<br><span class="sub">Countries, Cities & Landmarks</span>
>
> ```base
> formulas:
>   Type: |
>    list(type)
>      .map("(" + value + ")")
>
> properties:
>   file.name:
>     displayName: Name
>     
> views:
>   - type: cards
>     name: Cards
>     filters:
>       and:
>         - file.inFolder("Compendium/Atlas")
>     order:
>       - file.name
>       - formula.Type
>
>   - type: table
>     name: List
>     filters:
>       and:
>         - file.inFolder("Compendium/Atlas")
>     order:
>       - file.name
>       - type
> ```
> ---
>
> `BUTTON[plane, realm, continent, territory, province, locale, landmark]`

> [!lore]- Lore<br><span class="sub">Organizations, Deities, Relics & More</span>
>
> ```base
> formulas:
>   Type: |
>    list(type)
>      .map("(" + value + ")")
>
> properties:
>   file.name:
>     displayName: Name
>     
> views:
>   - type: cards
>     name: Cards
>     filters:
>       and:
>         - file.inFolder("Compendium/Lore")
>     order:
>       - file.name
>       - formula.Type
>     
>   - type: table
>     name: List
>     filters:
>       and:
>         - file.inFolder("Compendium/Lore")
>     order:
>       - file.name
>       - type
> ```
> ---
>
> `BUTTON[deity, event, object, org]`
