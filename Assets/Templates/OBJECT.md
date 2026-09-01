<%*
const { openForm, applyIcon, notifySuccess, getIcon, moveAndOpenFile, toCamelCase } = tp.user.utils;

const result = await openForm('OBJECT', 'Object');
if (!result) return;

const name = result.Name.value;
const type = result.Type.value;
const magical = result.Magical.value;
const cursed = result.Cursed.value;
const rarity = result.Rarity.value;
const image = result.Image.value || "Assets/Images/Placeholder/embed.jpg"
const icon = getIcon(type);

await moveAndOpenFile(tp, name);
applyIcon(`Compendium/Lore/Objects/${name}.md`, icon);
notifySuccess("object", name);
-%>

---

type: object
tags:
 - <% type? "object/" + toCamelCase(type): '' %>

---

###### <% name %>

<span class="sub2">:${icon}: <% [rarity, cursed && 'Cursed', magical && 'Magic', type].filter(Boolean).join(' ') %></span>

___

> [!infobox|no-t right]
> ![[<% image %>]]

> [!quote|no-t]
> Description of the <% type? type.toLowerCase(): 'object' %>, <% name %>.

> [!column|flex 3]
>
> > [!hint]- NPC's
> >
> > ```base
> > properties:
> >   file.name:
> >     displayName: Name
> > views:
> >   - type: table
> >     name: Name
> >     filters:
> >       and:
> >         - file.inFolder("Compendium/NPC's")
> >         - file.hasLink(this.file)
> > ```
>
> > [!note]- HISTORY
> >
> > ```base
> > properties:
> >   file.name:
> >     displayName: Name
> > views:
> >   - type: table
> >     name: Session Notes
> >     filters:
> >       and:
> >         - file.inFolder("Session Notes")
> >         - file.hasLink(this.file)
> > ```
