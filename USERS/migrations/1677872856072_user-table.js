/* eslint-disable camelcase */

// exports.shorthands = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    // check if exist 
    pgm.createTable('users', {
        id: { type: 'serial', primaryKey: true },
        first_name: { type: 'string', notNull: true },
        last_name: { type: 'string', notNull: true },
        pasport_id: { type: 'string', notNull: true, unique: true },
        date_of_birth: { type: 'date' },
        state: { type: 'state_type', notNull: false, default: null }
    });

    pgm.createType('state_type', ['entered', 'exited']);
}

// export async function down(pgm: MigrationBuilder): Promise<void> {
//     pgm.dropTable('users');
//     pgm.dropType('state_type');
// }

// CREATE TABLE users (id SERIAL PRIMARY KEY, first_name varchar(80), last_name varchar(80), pasport_id varchar(80), data_birth date, state state_type);
// ALTER TABLE users ADD COLUMN state state_type DEFAULT NULL;   -  добавить колонку