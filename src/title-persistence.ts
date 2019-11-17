import * as AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_DYNAMO_REGION });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const TABLE_NAME = 'snowDayNotifierTable';
const KEY_NAME = 'lastMatchedTitle';

export const getLastMatchedTitle = () => {
  return new Promise<string>((resolve, reject) => {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        CONFIG_KEY: { S: KEY_NAME },
      },
      ProjectionExpression: 'CONFIG_VALUE',
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
    const params = {
      TableName: TABLE_NAME,
      Item: {
        CONFIG_KEY: { S: KEY_NAME },
        CONFIG_VALUE: { S: articleTitle },
      },
    };

    ddb.putItem(params, err => {
      if (err) {
        console.error(
          'An error occurred while updating the last matched title from the database:',
          err,
        );
        reject(err);
      } else {
        console.info(
          'Successfully updated the last matched title in the database:',
          articleTitle,
        );
        resolve();
      }
    });
  });
};
