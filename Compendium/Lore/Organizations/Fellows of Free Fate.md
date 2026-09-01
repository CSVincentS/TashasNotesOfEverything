---
locations: []
tags: []
type: organization
---

###### Fellows of Free Fate

<span class="sub2">:FasCross: Religious Organization</span>

___

> [!quote|no-t]
> ![[triff.jpg|right wm-tl]]The Fellows of Free Fate, known locally as the Triffs, is a sect of [[Tymora|Tymoran]] clergy who dedicate themselves to fight against the actions of [[Beshaba|Beshaban]] followers, specifically the [[Black Fingers|Black Fingers]].

> [!column|flex 3]
>
> > [!tldr]- MEMBERS
> >
>> `BUTTON[orgMember]`
>>
>> ```base
>> formulas:
>>   Type: |
>>     if(file.inFolder("Compendium/Party/Player Characters"), "PC", "NPC")
>>   Role: |
>>     list(organizations).filter(value.org == this).map(value.role)[0]
>> properties:
>>   file.name:
>>     displayName: Name
>>   formula.Type:
>>     displayName: Type
>>   formula.Role:
>>     displayName: Role
>> views:
>>   - type: table
>>     name: Members
>>     filters:
>>       and:
>>         - or:
>>             - file.inFolder("Compendium/NPC's")
>>             - file.inFolder("Compendium/Party/Player Characters")
>>         - 'list(organizations).map(value.org).contains(this)'
>>     order:
>>       - file.name
>> ```
>
> > [!hint]- NPC's
> >
>> ```base
>> properties:
>>   file.name:
>>     displayName: Name
>> views:
>>   - type: table
>>     name: Name
>>     filters:
>>       and:
>>         - file.inFolder("Compendium/NPC's")
>>         - file.hasLink(this.file)
>>         - not:
>>             - 'list(organizations).map(value.org).contains(this)'
>> ```
>
> > [!info]- QUESTS
> >
>> ```base
>> properties:
>>   file.name:
>>     displayName: Name
>> views:
>>   - type: table
>>     name: Name
>>     filters:
>>       and:
>>         - file.inFolder("Compendium/Party/Quests")
>>         - 'list(assignor).contains(this)'
>>     order:
>>       - file.name
>> ```
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
