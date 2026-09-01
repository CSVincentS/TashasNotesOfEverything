<%*
const { openForm, applyIcon, notifySuccess, toCamelCase, moveAndOpenFile } = tp.user.utils;

const result = await openForm('DEITY', 'Deity');
if (!result) return;

const name = result.Name.value;
const alignment = result.Alignment.value;
const rank = result.Rank.value;
const pantheon = result.Pantheon.value;
const domains = result.Domains.value;
const gender = result.Gender.value;
const portrait = result.Portrait.value || "Assets/Images/Placeholder/portrait.jpg";
const tags = [
...(domains || []).map(value => ` - domain/${toCamelCase(value)}`),
...(result.Pantheon.value || []).map(value => ` - pantheon/${toCamelCase(value)}`)
].join("\n") || " -";

await moveAndOpenFile(tp, name);
applyIcon(`Compendium/Lore/Deities/${name}.md`, "RiCrossFill");
notifySuccess("deity", name);
-%>

---

type: deity
tags:
<% tags? tags: ' - ' %>

---

###### <% name %>

<span class="sub2">:FasCross: <% rank? rank : 'Deity' %><% alignment? `&nbsp; | &nbsp;:FasYinYang: ${alignment}`: '' %></span>

___

> [!infobox|no-t right]
> ![[<% portrait %>]]
> ###### Details:
>
> | Type | Stat |
> | ---- | ---- |
> | :FasCrown: Divine Rank | <% rank? rank: '' %> |
> | :FasBuildingColumns: Pantheon | <% pantheon? pantheon: '' %> |
> | :FasBoltLightning: Domains | <% domains? domains.join(', '): '' %> |
> | :FasVenusMars: Gender | <% gender? gender: '' %> |

> [!quote|no-t]
> Profile of <% name %>, the <% alignment? alignment.toLowerCase(): '' %> <% rank? rank.toLowerCase(): '' %>.

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
> >         - or:
> >             - file.hasLink(this.file)
> >             - file.hasLink("Add affiliation here")
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
