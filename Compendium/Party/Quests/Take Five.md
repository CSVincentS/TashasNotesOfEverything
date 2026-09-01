---
assignee: "[[LASTSTAND]]"
assignor:
locations:
  - "[[Baldurs Gate]]"
status: quest/completed
tags: []
type: quest
---

###### Take Five

<span class="sub2">:FasCircleExclamation: Quest &nbsp; | &nbsp;:FasListCheck: `INPUT[inlineSelect(option('quest/pending', 'Pending'), option('quest/ongoing', 'Ongoing'), option('quest/completed', 'Completed'), option('quest/failed', 'Failed'), option('quest/abandoned', 'Abandoned')):status]` </span>

___

> [!quote|no-t]
> ![[quest.png|right wm-sm]]After returning home, the members of LASTSTAND decide to take some well deserved personal time... But what will they do?

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
