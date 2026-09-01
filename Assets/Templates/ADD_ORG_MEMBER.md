<%*
const { openForm } = tp.user.utils;

const orgName = tp.file.title;

const result = await openForm('ORG_MEMBER', 'member');
if (!result) return;

const member = result.Member.value;
const role = (result.Role.value || "").trim();
if (!member) return;

const memberFile = app.vault.getMarkdownFiles().find(f =>
    f.basename === member &&
    (f.path.startsWith("Compendium/NPC's/") || f.path.startsWith("Compendium/Party/Player Characters/"))
);
if (!memberFile) {
    new Notice().noticeEl.innerHTML = `<span style="color: red; font-weight: bold;">Error:</span><br>Could not find a note for <span style="text-decoration: underline;">${member}</span>`;
    return;
}

const orgLink = `[[${orgName}]]`;
let alreadyMember = false;
let added = false;

await app.fileManager.processFrontMatter(memberFile, fm => {
    const orgs = Array.isArray(fm.organizations) ? fm.organizations : [];
    alreadyMember = orgs.some(o => o && o.org === orgLink);
    if (alreadyMember) return;
    const entry = { org: orgLink };
    if (role) entry.role = role;
    fm.organizations = [...orgs, entry];
    added = true;
});

if (alreadyMember) {
    new Notice().noticeEl.innerHTML = `<span style="color: orange; font-weight: bold;">Already a member:</span><br>${member} is already part of <span style="text-decoration: underline;">${orgName}</span>`;
} else if (added) {
    new Notice().noticeEl.innerHTML = `<span style="color: green; font-weight: bold;">Finished!</span><br>${member} added to <span style="text-decoration: underline;">${orgName}</span>${role ? ` as ${role}` : ''}`;
}
-%>
