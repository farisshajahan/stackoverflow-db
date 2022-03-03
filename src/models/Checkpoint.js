import { Model, snakeCaseMappers } from 'objection';

class Checkpoint extends Model {
  static get tableName() {
    return 'checkpoint';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['pageCount'],

      properties: {
        pageCount: { type: 'integer' },
      },
    };
  }

  static updatePageCount = async (pageCount) => {
    await Checkpoint.query().findById(1).patch({ pageCount });
  };

  static getPageCount = async () => (await Checkpoint.query().findById(1)).pageCount;
}

export default Checkpoint;
