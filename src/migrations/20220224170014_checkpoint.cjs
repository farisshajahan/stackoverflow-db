exports.up = (knex) =>
  knex.schema.createTable('checkpoint', (table) => {
    table.increments();
    table.integer('q_number').defaultTo(0);
  });

exports.down = (knex) => knex.schema.dropTable('checkpoint');
