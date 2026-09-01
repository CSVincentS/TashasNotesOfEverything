---
locations: []
tags: []
type: party
---

###### LASTSTAND

<span class="sub2">:FasPeopleGroup: Adventuring Party</span>

___

> [!quote|no-t]
> ![[laststand.jpg|right wm-tl]]Last Stand, stylized as **LASTSTAND**, is an adventuring group comprised of party members [[Kingston Yashkar|Kingston]], [[Moira Belkas|Moira]], [[Alaric Waycrest|Alaric]], and [[Tilda Rosesong|Tilda]].

> [!column|flex 3]
>
> > [!tldr]- MEMBERS
> >
> > `BUTTON[partyMember]`
> >
>> ```base
>> formulas:
>>   Type: |
>>     if(file.inFolder("Compendium/Party/Player Characters"), "PC", "NPC")
>> properties:
>>   file.name:
>>     displayName: Name
>>   formula.Type:
>>     displayName: Type
>> views:
>>   - type: table
>>     name: Members
>>     filters:
>>       and:
>>         - or:
>>             - file.inFolder("Compendium/NPC's")
>>             - file.inFolder("Compendium/Party/Player Characters")
>>         - 'list(parties).contains(this)'
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
>>             - 'list(parties).contains(this)'
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
>>     name: Quests
>>     filters:
>>       and:
>>         - file.inFolder("Compendium/Party/Quests")
>>         - 'list(assignee).contains(this)'
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
