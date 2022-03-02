import axios from 'axios';
import logger from 'pino';
import {
  getLastPageNumber,
  getQuestionMetadata,
  getRelatedQuestions,
  getQuestionsList,
} from '../utils/stackoverflow';
import Question from '../models/Question';
import throttler from '../utils/throttler';

const Crawler = () => {
  let crawlerRunning = false;
  const throttlerObj = throttler(5, 10);

  const processQuestion = async (question) => {
    const { questionObj, questionUrl } = await getQuestionMetadata(question);
    let relatedQuestions = [];
    await axios.get(questionUrl).then((response) => {
      relatedQuestions = getRelatedQuestions(response.data);
    });
    await Question.addQuestionToDatabase(questionObj).catch(logger.err);
    const refUpdatePromises = [];
    relatedQuestions.forEach((relatedQuestion) =>
      refUpdatePromises.push(Question.incrementRefCount(relatedQuestion.qId).catch(logger.err))
    );
    await Promise.all(refUpdatePromises).catch(logger.err);
  };

  const fetchAndParsePage = async (pageNum) => {
    const questionPromises = [];
    await axios
      .get(`https://stackoverflow.com/questions?tab=newest&page=${pageNum.toString()}`)
      .then((response) => {
        const questions = getQuestionsList(response.data);
        questions.each((_, question) => {
          questionPromises.push(
            throttlerObj.enqueue(async () => {
              await processQuestion(question);
            })
          );
        });
      });
    await Promise.all(questionPromises).catch(logger.warn);
  };

  const run = async () => {
    if (crawlerRunning) return;
    crawlerRunning = true;
    const response = await axios.get('https://stackoverflow.com/questions');
    let lastPageNum = getLastPageNumber(response.data);
    lastPageNum = 1;
    for (let i = lastPageNum; i >= 1; i -= 1) {
      /* eslint-disable no-await-in-loop */
      await fetchAndParsePage(i);
    }
    crawlerRunning = false;
  };

  return { run };
};

export default Crawler;
