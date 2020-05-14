const {pool} = require('./db')
const itemDB = require('./item')

module.exports = {
    getSectionById: async (id) => {
        let [section, ] = await pool.query(`
            SELECT * 
            FROM section 
            WHERE id=${id}`
        )

        section = section[0]
        section.items = await itemDB.getItemsBySection(section.id)
        return section
    },
    
    getSections: async () => {
        let [sections, ] = await pool.query(`
            SELECT * 
            FROM section
        `)

        for (i in sections) {
            sections[i].items = await itemDB.getItemsBySection(sections[i].id)
        }

        return sections.map(x => ({...x}))
    },

    getSectionsByPage: async (idPage) => {
        let [sections, ] = await pool.query(`
                SELECT *
                FROM section
                WHERE idPage = ${idPage}
        `)

        for (i in sections) {
            sections[i].items = await itemDB.getItemsBySection(sections[i].id)
        }

        return sections.map(x => ({...x}))
    },

    deleteSection: async (id) => {
        let [result, ] = await pool.query(`
            DELETE FROM section
            WHERE id=${id}
        `)

        return result.affectedRows == 1
    },

    addSection: async (title, description, visible, idPage) => {
        let [result, ] = await pool.query(`
                INSERT INTO section (id, title, description, visible, idPage) 
                VALUES (NULL, '${title}', '${description}', ${visible}, ${idPage});

                SELECT * FROM section 
                WHERE id=LAST_INSERT_ID() ;
        `)
        result = result[1]['0']

        return {...result};
    },

    updateSection: async (id, title, description, visible) => {
        let [result, ] = await pool.query(`
                UPDATE section
                SET
                    title='${title}', 
                    description='${description}', 
                    visible=${visible}
                WHERE id=${id}
        `)

        return result.affectedRows==1;
    },
}