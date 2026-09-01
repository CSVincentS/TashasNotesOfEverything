<%*
const { openForm, applyIcon, notifySuccess, getIcon, getPath, atlasPath, resolveParentType, moveAndOpenFile, toCamelCase } = tp.user.utils;

const result = await openForm('LOCALE', 'Locale');
if (!result) return;

const location = result.Location.value;
const name = result.Name.value;
const type = result.Type.value;
const icon = getIcon(type);
const banner = result.Banner.value || "Assets/Images/Placeholder/banner.jpg";
const path = getPath(location, resolveParentType(location, "territory"));

const newPath = atlasPath(name, location, path);
await moveAndOpenFile(tp, name, newPath);
applyIcon([newPath.replace(/\/[^/]+$/, ""), `${newPath}.md`], icon);
notifySuccess("locale", name);
-%>

---

type: locale
locations:
 - <% location? `"[[${location}]]"`: '' %>
tags:
 - <% type? `location/${toCamelCase(type)}`: '' %>

---

![[<% banner %>|banner]]

###### <% name %>

<span class="sub2"><% type? `:${icon}: ${type}`: "" %></span>

___

> [!quote|no-t] SUMMARY
> Description of the <% type? type.toLowerCase(): "locale" %> <% name %>.

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
> >     name: Landmarks
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
