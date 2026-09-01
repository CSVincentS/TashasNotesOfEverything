<%*
const { openForm } = tp.user.utils;

const partyName = tp.file.title;

const result = await openForm('PARTY_MEMBER', 'member');
if (!result) return;

const member = result.Member.value;
if (!member) return;

const memberFile = app.vault.getMarkdownFiles().find(f =>
    f.basename === member &&
    (f.path.startsWith("Compendium/NPC's/") || f.path.startsWith("Compendium/Party/Player Characters/"))
);
if (!memberFile) {
    new Notice().noticeEl.innerHTML = `<span style="color: red; font-weight: bold;">Error:</span><br>Could not find a note for <span style="text-decoration: underline;">${member}</span>`;
    return;
}

const partyLink = `[[${partyName}]]`;
let alreadyMember = false;
let added = false;

await app.fileManager.processFrontMatter(memberFile, fm => {
    const parties = Array.isArray(fm.parties) ? fm.parties : [];
    alreadyMember = parties.some(p => p === partyLink);
    if (alreadyMember) return;
    fm.parties = [...parties, partyLink];
    added = true;
});

if (alreadyMember) {
    new Notice().noticeEl.innerHTML = `<span style="color: orange; font-weight: bold;">Already a member:</span><br>${member} is already part of <span style="text-decoration: underline;">${partyName}</span>`;
} else if (added) {
    new Notice().noticeEl.innerHTML = `<span style="color: green; font-weight: bold;">Finished!</span><br>${member} added to <span style="text-decoration: underline;">${partyName}</span>`;
}
-%>
