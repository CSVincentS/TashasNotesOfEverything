<%*
const { openForm, applyIcon, notifySuccess, getIcon, getPath, atlasPath, moveAndOpenFile } = tp.user.utils;

const result = await openForm('CONTINENT', 'Continent');
if (!result) return;

const name = result.Name.value;
const type = result.Type.value;
const location = result.Location.value;
const banner = result.Banner.value || "Assets/Images/Placeholder/banner.jpg";
const icon = getIcon(type);
const path = getPath(location, "realm");

const newPath = atlasPath(name, location, path);
await moveAndOpenFile(tp, name, newPath);
applyIcon([newPath.replace(/\/[^/]+$/, ""), `${newPath}.md`], icon);
notifySuccess("continent", name);
-%>

---

type: <% (type || "continent").toLowerCase() %>
locations:
 - <% location? `"[[${location}]]"`: '' %>
tags:

---

![[<% banner %>|banner]]

###### <% name %>

<span class="sub2"><% type? `:${icon}: ${type}`: '' %></span>

___

> [!quote|no-t]
> Quick description of <% type? `the ${type.toLowerCase()}`: '' %> <% name %>.

> [!column|flex 3]
>
> > [!hint]- NPC's
> >
> > ```base
> > formulas:
> >   LinkedIndirectly: |
> >     locations.contains(this.file)
> >     || list(locations)
> >          .filter(file(value)
> >            && list(file(value).properties.locations).contains(this))
> >          .length > 0
> > 
> > properties:
> >   file.name:
> >     displayName: Name
> > 
> > views:
> >   - type: table
> >     name: This Location Only
> >     filters:
> >       and:
> >         - file.inFolder("Compendium/NPC's")
> >         - locations.contains(this.file)
> > 
> >   - type: table
> >     name: Sub-Locations Included
> >     filters:
> >       and:
> >         - file.inFolder("Compendium/NPC's")
> >         - formula.LinkedIndirectly
> > ```
>
> > [!example]- LOCATIONS
> >
> > ```base
> > properties:
> >   file.name:
> >     displayName: Name
> > views:
> >   - type: table
> >     name: Territories
> >     filters:
> >       and:
> >         - file.inFolder("Compendium/Atlas")
> >         - locations.contains(this.file)
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
