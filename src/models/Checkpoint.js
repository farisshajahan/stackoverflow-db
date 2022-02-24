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
      required: ['qNumber'],

      properties: {
        qNumber: { type: 'integer' },
      },
    };
  }
}

export default Checkpoint;
