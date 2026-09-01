<%*
const { openForm, applyIcon, notifySuccess, moveAndOpenFile } = tp.user.utils;

const result = await openForm('ORGANIZATION', 'Organization');
if (!result) return;

const name = result.Name.value;
const category = result.Category.value;
const type = result.Type.value;
const location = result.Location.value;
const image = result.Image.value || "Assets/Images/Placeholder/embed.jpg";

await moveAndOpenFile(tp, name);
applyIcon(`Compendium/Lore/Organizations/${name}.md`, "LiVenetianMask");
notifySuccess("organization", name);
-%>

---

type: organization
locations:
 - <% location? `"[[${location}]]"`: '' %>
tags:

---

###### <% name %>

<span class="sub2">:FasSitemap: <% category && type ? `${category} ${type}` : type ? type : category ? `${category} Organization` : 'Organization' %></span>

___

> [!infobox|no-t right]
> ![[<% image %>]]

> [!quote|no-t]
> Profile of <% name %>, the <% category ? category.toLowerCase() : 'unknown' %> <% type ? type.toLowerCase() : 'organization' %>.

> [!column|flex 3]
>
> > [!tldr]- MEMBERS
> >
> > `BUTTON[orgMember]`
> >
> > ```base
> > formulas:
> >   Type: |
> >     if(file.inFolder("Compendium/Party/Player Characters"), "PC", "NPC")
> >   Role: |
> >     list(organizations).filter(value.org == this).map(value.role)[0]
> > properties:
> >   file.name:
> >     displayName: Name
> >   formula.Type:
> >     displayName: Type
> >   formula.Role:
> >     displayName: Role
> > views:
> >   - type: table
> >     name: Members
> >     filters:
> >       and:
> >         - or:
> >             - file.inFolder("Compendium/NPC's")
> >             - file.inFolder("Compendium/Party/Player Characters")
> >         - 'list(organizations).map(value.org).contains(this)'
> >     order:
> >       - file.name
> > ```
> >
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
> >         - not:
> >             - 'list(organizations).map(value.org).contains(this)'
> > ```
>
> > [!info]- QUESTS
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
> >         - file.inFolder("Compendium/Party/Quests")
> >         - 'list(assignor).contains(this)'
> >     order:
> >       - file.name
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
