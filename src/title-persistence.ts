import * as AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_REGION });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

export const getLastMatchedTitle = () => {
  return new Promise<string>((resolve, reject) => {
    const params = {
      TableName: 'snowDayNotifierTable',
      Key: {
        key: { S: 'lastMatchedTitle' },
      },
    };

    ddb.getItem(params, (err, lastMatchedTitle) => {
      if (err) {
        console.error(
          'An error occurred while getting the last matched title from the database:',
          err,
        );
        reject(err);
      } else {
        console.info(
          'Successfully fetched the last matched title from the database:',
          JSON.stringify(lastMatchedTitle.Item, null, 2),
        );
        resolve(JSON.stringify(lastMatchedTitle.Item, null, 2));
      }
    });
  });
};

export const setLastMatchedTitle = (articleTitle: string) => {
  return new Promise<void>((resolve, reject) => {
    // TODO
    resolve();
  });
};
