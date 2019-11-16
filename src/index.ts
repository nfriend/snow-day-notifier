import { checkSiteForDelay } from './check-site-for-delay';
import { createIftttEvent } from './create-ifttt-event';

module.exports.checkForDelays = async () => {
  const iftttKeys = JSON.parse(process.env.IFTTT_KEYS);

  const checkSiteResults = await checkSiteForDelay();

  if (checkSiteResults.newDelayOrCancellationDetected) {
    await createIftttEvent(checkSiteResults.matchedArticleTitle, iftttKeys);
  }

  return 'checkForDelays executed successfully!';
};
