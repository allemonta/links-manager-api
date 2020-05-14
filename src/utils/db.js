const itemDB = require('../db/item')
const sectionDB = require('../db/section')
const sectionGroupDB = require('../db/sectionGroup')

const formatFileType = (fileType) => {
    return `
INSERT INTO fileType (type, path, classes)
VALUES ('${fileType.type}', '${fileType.path}', '${fileType.classes}');
`
}

const formatSectionGroup = (sectionGroup) => {
    return `
INSERT INTO sectionGroup (id, title, description)
VALUES (${sectionGroup.id}, '${sectionGroup.title}', '${sectionGroup.description}');
`
}

const formatSection = (section) => {
    return `
INSERT INTO section (id, title, description, visible, idSectionGroup)
VALUES (${section.id}, '${section.title}', '${section.description}', ${section.visible}, ${section.idSectionGroup});
`
}

const formatItem = (item) => {
    return `
INSERT INTO item (id, path, title, visible, nested, idSetion, fileType)
VALUES (${item.id}, '${item.path}', '${item.title}', ${item.visible}, ${item.nested}, ${item.idSection}, '${item.fileType}');
`
}

module.exports = {
    databaseBackup: async () => {
        let sectionGroups = await sectionGroupDB.getSectionGroups()
        let fileTypes = await itemDB.getFileTypes()

        let toReturn = '';
        for (i in fileTypes)
        {
            toReturn += formatFileType(fileTypes[i])
        }

        for (i in sectionGroups)
        {
            toReturn += formatSectionGroup(sectionGroups[i])

            for (j in sectionGroups[i].sections) {
                toReturn += formatSection(sectionGroups[i].sections[j])

                for (k in sectionGroups[i].sections[j].items)
                    toReturn += formatItem(sectionGroups[i].sections[j].items[k])
            }
        }

        return toReturn
    }
}