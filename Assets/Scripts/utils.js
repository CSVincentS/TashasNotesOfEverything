const dv = app.plugins.plugins.dataview?.api;
module.exports = {
    asArray: v => v == null ? [] : Array.isArray(v) ? v : [v],

    yamlList: arr => arr.length ? arr.map(v => ` - "${v}"`).join("\n") : " -",

    toCamelCase: str => String(str)
        .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : "")
        .replace(/^(.)/, c => c.toLowerCase()),

    openForm: async (name, label) => {
        const result = await MF.openForm(name);
        if (result.status !== 'ok') {
            new Notice().noticeEl.innerHTML = `<span style="color: red; font-weight: bold;">Cancelled:</span><br>${label} has not been added`;
            return null;
        }
        return result;
    },

    applyIcon: (paths, icon) => {
        const iconize = app.plugins.plugins["obsidian-icon-folder"];
        if (!iconize) return;
        for (const p of Array.isArray(paths) ? paths : [paths]) {
            iconize.addFolderIcon(p, icon);
            iconize.api.util.dom.createIconNode(iconize, p, icon);
        }
    },

    notifySuccess: (label, name) => {
        new Notice().noticeEl.innerHTML = `<span style="color: green; font-weight: bold;">Finished!</span><br>New ${label} <span style="text-decoration: underline;">${name}</span> added`;
    },

    atlasPath: (name, location, path) =>
        `Compendium/Atlas/${location ? `${path}/` : ''}${name}/${name}`,

    resolveParentType: (location, fallback = "territory") => {
        const page = dv?.pages().find(p => p.file.name === location);
        return page?.type?.toLowerCase() ?? fallback;
    },

    nextSessionNumber: () => {
        const sessionRegex = /^Session Notes\/Session (\d+)/;
        const n = app.vault.getMarkdownFiles()
            .reduce((max, f) => Math.max(max, (f.path.match(sessionRegex) || [])[1] || 0), 0) + 1;
        return n < 10 ? '0' + n : String(n);
    },

    getIcon: (type) => {
        const iconMappings = {
            Academy: 'FasSchool',
            Alchemist: 'FasLeaf',
            Apothecary: 'FasFlaskVial',
            Arena: 'RiSwordFill',
            Armor: 'FasShield',
            Armory: 'FasHammer',
            Bank: 'RiBankFill',
            Barracks: 'LiCastle',
            Bathhouse: 'FasBath',
            Bazaar: 'FasCartShopping',
            Blacksmith: 'FasHammer',
            Bookstore: 'FasBook',
            Brewery: 'RiDrinksFill',
            Brothel: 'FasVenusMars',
            Butcher: 'bone',
            Camp: 'FasCampground',
            Carpenter: 'FasHammer',
            Cartographer: 'FasMap',
            Castle: 'LiCastle',
            Cave: 'FasMound',
            Cemetery: 'FasGhost',
            Chapel: 'FasChurch',
            Church: 'FasChurch',
            City: 'FasCity',
            Clothing: 'FasShirt',
            Cobbler: 'FasShoePrints',
            Coliseum: 'RiSwordFill',
            Continent: 'FasEarthAmericas',
            Cooperage: 'FasBucket',
            Cosmic: 'FasCircleQuestion',
            Courier: 'RiMailFill',
            County: 'FasLandmark',
            Country: 'FasFlag',
            Court: 'FasHammer',
            Criminal: 'FasCircleQuestion',
            Cultural: 'FasCircleQuestion',
            Desert: 'FasSun',
            Discovery: 'FasCircleQuestion',
            Dockhouse: 'FasSailboat',
            Dyer: 'FasShirt',
            Economic: 'FasCircleQuestion',
            Embassy: 'FasSchoolFlag',
            Encampment: 'FasTowerObservation',
            Environmental: 'FasCircleQuestion',
            Exorcist: 'FasGhost',
            Fletcher: 'RiFlowerFill',
            Forest: 'FasTree',
            Gallow: 'RiCriminalFill',
            Garden: 'RiFlowerFill',
            Garrison: 'RiSwordFill',
            Gatehouse: 'FasHouseLock',
            'General Region': 'FasMap',
            Guildhall: 'FasShield',
            Herbalist: 'FasLeaf',
            Hospital: 'FasHospital',
            Inn: 'FasBed',
            Jail: 'RiCriminalFill',
            Jeweler: 'FasGem',
            Jewelry: 'FasGem',
            Kingdom: 'FasChessRook',
            Lake: 'FasWater',
            Library: 'FasBookOpen',
            Locksmith: 'FasLock',
            Market: 'FasScaleUnbalanced',
            Military: 'FasCircleQuestion',
            Monastery: 'FasChurch',
            Morgue: 'FasSkull',
            Mountain: 'FasMountain',
            Mystical: 'FasCircleQuestion',
            Nation: 'FasFlag',
            Natural: 'FasCircleQuestion',
            Ocean: 'FasWater',
            Orphanage: 'FasChild',
            Personal: 'FasCalendarDays',
            Plains: 'FasWheatAwn',
            Plaza: 'FasHandshakeSimple',
            Poison: 'FasBiohazard',
            Political: 'FasBullhorn',
            Port: 'FasSailboat',
            Potion: 'FasPrescriptionBottleMedical',
            Potter: 'FasHammer',
            Province: 'FasLandmark',
            'Quest Item': 'FasScroll',
            Relic: 'FasBookOpen',
            Religious: 'FasCross',
            'Religious Artifact': 'FasCross',
            Residence: 'FasHouse',
            Scroll: 'FasScroll',
            Seasonal: 'RiSunFoggyFill',
            Shop: 'FasCartShopping',
            Shrine: 'FasChurch',
            Social: 'FasCircleQuestion',
            Stable: 'FasHorseHead',
            State: 'FasLandmark',
            Stonemason: 'FasHammer',
            Swamp: 'FasSmog',
            Tailor: 'FasShirt',
            Tavern: 'RiBeerFill',
            Temple: 'FasChurch',
            Theater: 'FasMasksTheater',
            Tower: 'FasTowerObservation',
            Town: 'RiBuilding4Fill',
            Treasure: 'RiVipDiamondFill',
            Village: 'FasTents',
            Warehouse: 'FasWarehouse',
            Weapon: 'RiSwordFill',
            Well: 'FasBucket'
        };
        return iconMappings[type] || 'FasCircleQuestion';
    },

    getPath: (location, type, folder = "Compendium/Atlas") => {
        if (!dv || !location || !type) return "";
        const match = dv.pages(`"${folder}"`)
            .where(p => p.type === type && p.file.name === location)
            .map(obj => obj.file.path.split("/").slice(2, -1).join("/"))
            .find(Boolean);
        return match || "";
    },

    moveAndOpenFile: async (tp, name, newPath) => {
        if (newPath) {
            await tp.file.move(newPath);
            await app.workspace.getLeaf(true).openFile(tp.file.find_tfile(newPath));
        } else {
            await tp.file.rename(name);
            await app.workspace.getLeaf(true).openFile(tp.file.find_tfile(name));
        }
    }
};
