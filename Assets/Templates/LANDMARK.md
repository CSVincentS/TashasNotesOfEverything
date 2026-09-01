<%*
const { openForm, applyIcon, notifySuccess, getIcon, getPath, atlasPath, moveAndOpenFile, toCamelCase } = tp.user.utils;

const result = await openForm('LANDMARK', 'Landmark');
if (!result) return;

const name = result.Name.value;
const type = result.Type.value;
const location = result.Location.value;
const banner = result.Banner.value || "Assets/Images/Placeholder/banner.jpg";
const icon = getIcon(type);
const path = getPath(location, "locale");

const newPath = atlasPath(name, location, path);
await moveAndOpenFile(tp, name, newPath);
applyIcon([newPath.replace(/\/[^/]+$/, ""), `${newPath}.md`], icon);
notifySuccess("landmark", name);
-%>

---

cssClasses: wideTable
type: landmark
locations:
 - <% location? `"[[${location}]]"`: '' %>
tags:
 - <% type? `location/${toCamelCase(type)}`: '' %>

---

![[<% banner %>|banner]]

###### <% name %>

<span class="sub2"><% type? `:${icon}: ${type}`: '' %></span>

___

> [!quote|no-t] SUMMARY
> Description of the <% type? type.toLowerCase(): 'landmark' %> <% name %>.

| INVENTORY                  | PRICE |
| -------------------------- | ----- |
| Item 1 | 5 <span class="platinumcoin">:RiCoinsFill:</span> |
| Item 2 | 80 <span class="goldcoin">:RiCoinsFill:</span> |
| Item 3 | 20 <span class="silvercoin">:RiCoinsFill:</span> |
| Item 4 | 100 <span class="coppercoin">:RiCoinsFill:</span> |

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
