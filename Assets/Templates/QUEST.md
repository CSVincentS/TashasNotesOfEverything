<%*
const { openForm, applyIcon, notifySuccess, toCamelCase, moveAndOpenFile } = tp.user.utils;

const result = await openForm('QUEST', 'Quest');
if (!result) return;

const name = result.Name.value;
const status = result.Status.value;
const assignor = result.Assignor.value;
const assignee = result.Assignee.value;
const location = result.Location.value;
const image = result.Image.value || "Assets/Images/Placeholder/quest.png";

applyIcon(`Compendium/Party/Quests/${name}.md`, "FasExclamation");
await moveAndOpenFile(tp, name);
notifySuccess("quest", name);
-%>

---

type: quest
status: <% status? `quest/${toCamelCase(status)}`: 'quest/pending' %>
assignor: <% assignor? `"[[${assignor}]]"`: '' %>
assignee: <% assignee? `"[[${assignee}]]"`: '' %>
locations:
 - <% location? `"[[${location}]]"`: '' %>
tags:
 -

---

###### <% name %>

<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: `INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]`<% assignor? ` &nbsp; | &nbsp;:FasHandshakeSimple: [[${assignor}]]`: '' %><% assignee? ` &nbsp; | &nbsp;:FasUser: [[${assignee}]]`: '' %></span>

___

> [!infobox|no-t right]
> ![[<% image %>]]
> ##### Rewards:
>
> | Type | Amount |
> | ---- | ---- |
> | <span class="coppercoin">:RiCoinsFill:</span> | 0 |
> | <span class="silvercoin">:RiCoinsFill:</span> | 0 |
> | <span class="goldcoin">:RiCoinsFill:</span> | 0 |
> | <span class="platinumcoin">:RiCoinsFill:</span> | 0 |

> [!quote|no-t]
> Quest description here...

> [!column|flex 3]
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
