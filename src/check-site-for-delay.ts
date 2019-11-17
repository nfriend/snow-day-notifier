import * as cheerio from 'cheerio';
import * as rp from 'request-promise';
import { getLastMatchedTitle, setLastMatchedTitle } from './title-persistence';

export interface SiteCheckResult {
  newDelayOrCancellationDetected: boolean;
  matchedArticleTitle?: string;
}

// checks the public school branch's website
// for any mention of delay of cancellation and
// returns true if found
const checkSiteForDelay = async (): Promise<SiteCheckResult> => {
  const publicSchoolBranchUrl = `https://edu.princeedwardisland.ca/psb/`;

  console.info('Making request to the public school branch website...');
  const pageHtml = await rp(publicSchoolBranchUrl);
  console.info('Successfully received response');

  console.info('Scraping for page titles...');
  const $ = cheerio.load(pageHtml);
  const articleTitles: string[] = [];
  $('#content article.post .entry-title a').each((index, element) => {
    articleTitles.push($(element).html());
  });

  console.info(
    'Found the following titles:\n' +
      articleTitles.map(t => ' - ' + t).join('\n'),
  );

  let matchedArticle: string;
  const foundMatch = articleTitles.some(t => {
    // test the headline to see if it contains any
    // of the trigger words
    const titleTest = /delay|dismiss|early|cancel|close|closure|snow|ice|fog|flood|visibility|storm|wind|sleet|hail|freeze|freezing/gi;
    if (titleTest.test(t)) {
      matchedArticle = t;
      return true;
    } else {
      return false;
    }
  });

  if (foundMatch) {
    console.info(`Found match in title "${matchedArticle}"`);
  } else {
    console.info('No match found in any of the titles');
  }

  // make sure that if we *did* find a match, we haven't
  // already detected this match before.
  const lastMatchedTitle = await getLastMatchedTitle();
  if (foundMatch && lastMatchedTitle !== matchedArticle) {
    await setLastMatchedTitle(matchedArticle);

    console.info('Match is new, and an IFTTT event will be triggered');

    return {
      newDelayOrCancellationDetected: foundMatch,
      matchedArticleTitle: lastMatchedTitle,
    };
  } else {
    if (foundMatch) {
      console.info(
        'Match has was previously found; no IFTTT event will be triggered',
      );
    }

    return {
      newDelayOrCancellationDetected: false,
    };
  }
};

export { checkSiteForDelay };
