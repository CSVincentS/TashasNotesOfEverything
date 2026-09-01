<%*
const { openForm, applyIcon, notifySuccess, toCamelCase, moveAndOpenFile } = tp.user.utils;

const result = await openForm('NPC', 'NPC');
if (!result) return;

const name = result.Name.value;
const race = result.Race.value;
const gender = result.Gender.value;
const alignment = result.Alignment.value;
const location = result.Location.value;
const job = result.Job.value;
const portrait = result.Portrait.value || "Assets/Images/Placeholder/portrait.jpg";
const tags = [
    race && `race/${toCamelCase(race)}`,
    alignment && `alignment/${toCamelCase(alignment)}`,
    job && `job/${toCamelCase(job)}`
].filter(Boolean).map(v => ` - ${v}`).join("\n") || " - ";

applyIcon(`Compendium/NPC's/${name}.md`, "RiContactsFill");
await moveAndOpenFile(tp, name);
notifySuccess("NPC", name);
-%>

---

type: npc
locations:
 - <% location? `"[[${location}]]"`: '' %>
organizations:
 -
parties:
 -
tags:
<% tags %>

---

###### <% name %>

<span class="sub2"><% location? `:FasMapLocationDot: [[${location}]]`: '' %><% alignment? ` |:FasHeartPulse: ${alignment}`: '' %></span>

___

> [!infobox|no-t right]
> ![[<% portrait %>]]
> ###### Details:
>
> | Type | Stat |
> | ---- | ---- |
> | :FasUser: Race | <% race? race: '' %> |
> | :FasVenusMars: Gender | <% gender? gender: '' %> |
> | :FasBriefcase: Job | <% job? job: '' %> |

> [!quote|no-t]
> Profile of <% name %>, the <% `${gender? gender.toLowerCase(): ''}${race? (gender? ' ': '') + race: ''}` %> NPC.

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
