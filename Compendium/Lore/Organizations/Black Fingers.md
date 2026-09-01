---
locations: []
tags: []
type: organization
---

###### The Black Fingers

<span class="sub2">:FasCross: Religious Organization</span>

___

> [!quote|no-t]
> ![[blackfinger.jpg|right wm-sm]]A secret society of assassins devoted to the goddess [[Beshaba]] a.k.a the "Maiden of Misfortune". Comprising predominantly of male clergy, seasoned warriors, and cunning thieves, the group operates in the shadows, executing deadly missions with precision. Cloaked in secrecy, their loyalty to Bashaba binds them to a code of silence, adding an air of mystery to their enigmatic existence. The Black Fingers thrive on chaos, spreading misfortune to achieve their divine purpose and leaving an ominous mark on those who encounter their lethal touch.
<span class="clearfix"></span>

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
