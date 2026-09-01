---
assignee: "[[Alaric Waycrest]]"
assignor:
locations: []
status: quest/pending
tags: []
type: quest
---

###### Double Trouble

<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: `INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]` </span>

___

> [!quote|no-t]
> ![[quest.png|right wm-sm]] Is a dark secret is being kept from the group...?

> [!column|flex 3]
>
> > [!note]- HISTORY
> >
>> ```base
>> properties:
>>   file.name:
>>     displayName: Name
>> views:
>>   - type: table
>>     name: Session Notes
>>     filters:
>>       and:
>>         - file.inFolder("Session Notes")
>>         - file.hasLink(this.file)
>> ```
