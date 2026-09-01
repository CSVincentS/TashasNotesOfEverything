<%*
const { openForm, applyIcon, notifySuccess, toCamelCase, moveAndOpenFile, yamlList } = tp.user.utils;

const result = await openForm('PC', 'Player character');
if (!result) return;

const name = result.Name.value;
const race = result.Race;
const gender = result.Gender.value;
const level = result.Level;
const pClass = result.pClass.value?.length? result.pClass.value: [];
const subClass = result.subClass.value?.length? result.subClass.value: [];
const alignment = result.Alignment.value;
const portrait = result.Portrait.value || "Assets/Images/Placeholder/portrait.jpg";
const tags = [
...pClass.map(v => ` - class/${toCamelCase(v)}`),
...subClass.map(v => ` - subclass/${toCamelCase(v)}`),
  race? ` - race/${toCamelCase(race)}`: null
].filter(Boolean).join("\n") || " -";

applyIcon(`Compendium/Party/Player Characters/${name}.md`, "RiSwordFill");
await moveAndOpenFile(tp, name);
notifySuccess("player character", name);
-%>

---

type: pc
level: "<% level %>"
gender: "<% gender? gender: '' %>"
race: "<% race %>"
class:
<% pClass.length? yamlList(pClass): ' - ""' %>
subClass:
<% subClass.length? yamlList(subClass): ' - ""' %>
organizations:
 -
parties:
 -
cover: "<% portrait %>"
tags:
<% tags %>

---

###### <% name %>

<span class="sub2">:FasPerson: Player Character &nbsp; | &nbsp;:FasYinYang: <% alignment %></span>

___

> [!infobox|no-t right]
> ![[<% portrait %>]]
> ###### Details:
>
> | Type | Stat |
> | ---- | ---- |
> |:FasCrown: Level | `=this.level` |
> |:RiSwordFill: Class |`=join(this.class, "<br>")`|
> |:FasFireFlameCurved: Subclass | `=join(this.subClass, "<br>")`|
> |:FasUserGroup: Race | `=this.race` |
> |:FasVenusMars: Gender | `=this.gender` |

> [!quote|no-t]
> Character description here

> [!column|flex 3]
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
