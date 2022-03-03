import axios from 'axios';
import Pino from 'pino';
import {
  getLastPageNumber,
  getQuestionMetadata,
  getRelatedQuestions,
  getQuestionsList,
} from '../utils/stackoverflow';
import Question from '../models/Question';
import Checkpoint from '../models/Checkpoint';
import throttler from '../utils/throttler';

const Crawler = () => {
  let stopSignal = false;
  let crawlerRunning = false;
  const throttlerObj = throttler(5, 10);
  const logger = Pino({ name: 'crawler' });

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
          if (!stopSignal) {
            questionPromises.push(
              throttlerObj.enqueue(async () => {
                await processQuestion(question);
              })
            );
          }
        });
      });
    await Promise.all(questionPromises).catch(() => logger.warn('Question promises rejected'));
  };

  const run = async (resume) => {
    if (crawlerRunning) return;
    stopSignal = false;
    crawlerRunning = true;
    const response = await axios.get('https://stackoverflow.com/questions');
    let lastPageNum = getLastPageNumber(response.data) - 20;
    if (resume) lastPageNum -= await Checkpoint.getPageCount();
    else await Question.query().delete();
    let currPageNum;
    for (currPageNum = lastPageNum; currPageNum >= 1; currPageNum -= 1) {
      if (stopSignal) break;
      /* eslint-disable no-await-in-loop */
      await fetchAndParsePage(currPageNum);
    }
    await Checkpoint.updatePageCount(lastPageNum - currPageNum - 1);
    stopSignal = false;
    crawlerRunning = false;
  };

  const stop = async () => {
    stopSignal = true;
    throttlerObj.clearQueue();
  };

  return { run, stop };
};

export default Crawler;
