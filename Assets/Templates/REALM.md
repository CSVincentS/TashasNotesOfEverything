<%*
const { openForm, applyIcon, notifySuccess, getPath, atlasPath, moveAndOpenFile } = tp.user.utils;

const result = await openForm('REALM', 'Realm');
if (!result) return;

const name = result.Name.value;
const location = result.Location.value;
const banner = result.Banner.value || "Assets/Images/Placeholder/banner.jpg";
const path = getPath(location, "plane");

const newPath = atlasPath(name, location, path);
await moveAndOpenFile(tp, name, newPath);
applyIcon([newPath.replace(/\/[^/]+$/, ""), `${newPath}.md`], "FasGlobe");
notifySuccess("realm", name);
-%>

---

type: realm
locations:
 - <% location? `"[[${location}]]"`: '' %>
tags:

---

![[<% banner %>|banner]]

###### <% name %>

<span class="sub2">:FasGlobe: Realm (world)</span>

___

> [!quote|no-t] SUMMARY
> Description of the realm <% name %>.

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
> >     name: Continents
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
