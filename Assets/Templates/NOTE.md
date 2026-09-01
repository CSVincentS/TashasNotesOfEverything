<%*
const { openForm, applyIcon, notifySuccess, toCamelCase, moveAndOpenFile, nextSessionNumber } = tp.user.utils;

const result = await openForm('NOTE', 'Session note');
if (!result) return;

const title = result.Title.value;
const date = result.Date.value;
const location = result.Location.value? result.Location.value.map(value => `- "[[${value}]]"`).join("\n"): '';
const tags = result.Tags.value
? result.Tags.value.map(value => value.startsWith('#')? ` - ${value.slice(1)}`: ` - ${toCamelCase(value)}`).join("\n")
: '';
const banner = result.Banner.value || "Assets/Images/Placeholder/session.png"
const number = nextSessionNumber();
const name = `Session ${number}`;

await moveAndOpenFile(tp, name);
applyIcon(`Session Notes/${name}.md`, "LiNotebookPen");
notifySuccess("note", name);
-%>

---

type: notes
locations:
<% location? location: ' - '%>
tags:
<% tags? tags: ' - '%>
date: "<% date %>"

---

![[<% banner %>|banner]]

###### <% title %>

<span class="sub2">:FasTags: `VIEW[{tags}][text]`</span>

___

> [!quote|no-t] SUMMARY
> Recap of the session's events here.

> [!column|flex 3]
>
> > [!hint] NPC's
> > - [[Character]] (status)
>
> > [!example] LOCATIONS
> > - [[Locations]] (status)
>
> > [!info] QUESTS
> > - [[Quests]] (status)
