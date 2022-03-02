exports.up = (knex) =>
  knex.schema.alterTable('questions', (table) => {
    table.integer('q_id').alter().unique();
  });

exports.down = () => {};
