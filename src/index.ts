import { checkSiteForDelay } from './check-site-for-delay';
import { createIftttEvent } from './create-ifttt-event';

module.exports.checkForDelays = async () => {
  const checkSiteResults = await checkSiteForDelay();
  if (checkSiteResults.newDelayOrCancellationDetected) {
    await createIftttEvent(checkSiteResults.matchedArticleTitle, [
      'todo: key here',
    ]);
  }
};
