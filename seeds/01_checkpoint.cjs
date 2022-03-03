exports.seed = async (knex) => {
  await knex('checkpoint').del();
  await knex('checkpoint').insert([{ id: 1, page_count: 0 }]);
};
