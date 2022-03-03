exports.up = (knex) =>
  knex.schema.table('checkpoint', (table) => {
    table.renameColumn('q_number', 'page_count');
  });

exports.down = (knex) =>
  knex.schema.table('checkpoint', (table) => {
    table.renameColumn('page_count', 'q_number');
  });
