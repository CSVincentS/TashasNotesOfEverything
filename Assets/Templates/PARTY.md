<%*
const { openForm, applyIcon, notifySuccess, moveAndOpenFile } = tp.user.utils;

const result = await openForm('PARTY', 'Party');
if (!result) return;

const name = result.Name.value;
const tags = " -";

applyIcon(`Compendium/Party/${name}.md`, "FasPeopleGroup");
await moveAndOpenFile(tp, name);
notifySuccess("party", name);
-%>

---

type: party
tags:
<% tags %>

---

###### <% name %>

<span class="sub2">:FasPeopleGroup: Party</span>

___

> [!quote|no-t]
> Party description here...

> [!column|flex 3]
>
> > [!tldr]- MEMBERS
> >
> > `BUTTON[partyMember]`
> >
> > ```base
> > formulas:
> >   Type: |
> >     if(file.inFolder("Compendium/Party/Player Characters"), "PC", "NPC")
> > properties:
> >   file.name:
> >     displayName: Name
> >   formula.Type:
> >     displayName: Type
> > views:
> >   - type: table
> >     name: Members
> >     filters:
> >       and:
> >         - or:
> >             - file.inFolder("Compendium/NPC's")
> >             - file.inFolder("Compendium/Party/Player Characters")
> >         - 'list(parties).contains(this)'
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
> >             - 'list(parties).contains(this)'
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
> >     name: Quests
> >     filters:
> >       and:
> >         - file.inFolder("Compendium/Party/Quests")
> >         - 'list(assignee).contains(this)'
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
