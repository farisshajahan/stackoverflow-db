import { Model } from 'objection';

class Question extends Model {
  static get tableName() {
    return 'questions';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['q_id'],

      properties: {
        id: { type: 'integer' },
        qId: { type: 'integer' },
        title: { type: 'string' },
        refCount: { type: 'integer' },
        upvotes: { type: 'integer' },
        answerCount: { type: 'integer' },
      },
    };
  }
}

export default Question;
