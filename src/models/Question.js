import { Model, snakeCaseMappers } from 'objection';

class Question extends Model {
  static get tableName() {
    return 'questions';
  }

  static get columnNameMappers() {
    return snakeCaseMappers();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['qId'],

      properties: {
        id: { type: 'integer' },
        qId: { type: 'integer' },
        qUrl: { type: 'string' },
        title: { type: 'string' },
        refCount: { type: 'integer' },
        upvotes: { type: 'integer' },
        answerCount: { type: 'integer' },
      },
    };
  }
}

export default Question;
