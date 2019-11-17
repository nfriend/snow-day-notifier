import { Marshaller } from '@aws/dynamodb-auto-marshaller';
import * as AWS from 'aws-sdk';

AWS.config.update({ region: process.env.AWS_DYNAMO_REGION });

const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const TABLE_NAME = 'snowDayNotifierTable';
const KEY_NAME = 'lastMatchedTitle';

const marshaller = new Marshaller();

export const getLastMatchedTitle = () => {
  return new Promise<string>((resolve, reject) => {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        CONFIG_KEY: { S: KEY_NAME },
      },
      ProjectionExpression: 'CONFIG_VALUE',
    };

    ddb.getItem(params, (err, data) => {
      if (err) {
        console.error(
          'An error occurred while getting the last matched title from the database:',
          err,
        );

        reject(err);
      } else {
        const { CONFIG_VALUE: configValue } = marshaller.unmarshallItem(
          data.Item,
        );

        const lastMatchedTitle = configValue
          ? configValue.toString()
          : undefined;

        console.info(
          'Successfully fetched the last matched title from the database:',
          lastMatchedTitle,
        );

        resolve(lastMatchedTitle);
      }
    });
  });
};

export const setLastMatchedTitle = (articleTitle: string) => {
  return new Promise<void>((resolve, reject) => {
    const params = {
      TableName: TABLE_NAME,
      Item: marshaller.marshallItem({
        CONFIG_KEY: KEY_NAME,
        CONFIG_VALUE: articleTitle,
      }),
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
