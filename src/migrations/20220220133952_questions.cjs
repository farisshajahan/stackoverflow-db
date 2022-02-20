exports.up = (knex) =>
  knex.schema.createTable('questions', (table) => {
    table.increments('id').primary();
    table.integer('q_id').notNullable();
    table.text('title', 'longtext');
    table.integer('ref_count').defaultTo(0);
    table.integer('upvotes').defaultTo(0);
    table.integer('answer_count').defaultTo(0);
  });

exports.down = (knex) => knex.schema.dropTable('questions');
