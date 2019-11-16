import { checkSiteForDelay } from './check-site-for-delay';
import { createIftttEvent } from './create-ifttt-event';

module.exports.checkForDelays = async () => {
  const checkSiteResults = await checkSiteForDelay();

  const iftttKeys = JSON.parse(process.env.IFTTT_KEYS);

  console.log('iftttKeys:', iftttKeys);

  if (checkSiteResults.newDelayOrCancellationDetected) {
    await createIftttEvent(checkSiteResults.matchedArticleTitle, iftttKeys);
  }
};
