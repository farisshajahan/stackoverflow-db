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

  static addQuestionToDatabase = async (questionObj) => {
    if ((await Question.query().where('q_id', questionObj.qId)).length) {
      await Question.query().patch(questionObj).where('q_id', questionObj.qId);
    } else await Question.query().insert(questionObj);
  };

  static incrementRefCount = async (qId) => {
    const entry = await Question.query().where('q_id', qId);
    if (entry.length) {
      await Question.query().increment('ref_count', 1).where('q_id', qId);
    } else {
      await Question.addQuestionToDatabase({ refCount: 1, qId });
    }
  };
}

export default Question;
