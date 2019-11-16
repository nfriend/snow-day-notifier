import * as rp from 'request-promise';

const EVENT_NAME = 'snow-day';

/**
 * Generates an IFTTT event
 * @param articleTitle The title of the article
 * @param iftttKeys The IFTTT keys to notify
 */
const createIftttEvent = async (articleTitle: string, iftttKeys: string[]) => {
  const payload = {
    json: {
      value1: articleTitle,
    },
  };

  for (const key of iftttKeys) {
    const iftttUrl = `https://maker.ifttt.com/trigger/${EVENT_NAME}/with/key/${key}`;
    console.info(
      `Sending POST request to ${iftttUrl}:`,
      JSON.stringify(payload, null, 2),
    );
    const iftttResult1 = await rp.post(iftttUrl, payload);
    console.info('Response from IFTTT:', iftttResult1);
  }
};

export { createIftttEvent };
