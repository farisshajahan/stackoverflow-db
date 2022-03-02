import * as cheerio from 'cheerio';

export const getLastPageNumber = (listQuestionsHtml) => {
  const $ = cheerio.load(listQuestionsHtml);
  const pages = $('.s-pagination--item');
  return parseInt(pages[pages.length - 2].children[0].data, 10);
};

export const getRelatedQuestions = (questionPageHtml) => {
  const $ = cheerio.load(questionPageHtml);
  const relatedQuestionsObj = $('.sidebar-related').find('.question-hyperlink');
  const relatedQuestions = [];
  relatedQuestionsObj.each((_, question) =>
    relatedQuestions.push({ qId: parseInt(question.attribs.href.split('/')[2], 10) })
  );
  return relatedQuestions;
};

export const getQuestionMetadata = async (questionHtml) => {
  const question = cheerio.load(questionHtml);
  const title = question('.s-post-summary--content > .s-post-summary--content-title > a').text();
  const url = question('.s-post-summary--content > .s-post-summary--content-title > a').attr().href;
  const qId = parseInt(url.split('/')[2], 10);
  const stats = question('.s-post-summary--stats-item-number.mr4');
  const upvotes = parseInt(stats[0].children[0].data, 10);
  const answerCount = parseInt(stats[1].children[0].data, 10);
  return {
    questionObj: { qId, title, upvotes, answerCount },
    questionUrl: `https://stackoverflow.com${url}`,
  };
};

export const getQuestionsList = (questionListHtml) => {
  const $ = cheerio.load(questionListHtml);
  return $('.s-post-summary.js-post-summary');
};

export default { getLastPageNumber, getRelatedQuestions, getQuestionMetadata, getQuestionsList };
