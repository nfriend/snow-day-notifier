let mockArticleTitle;
jest.mock('request-promise', () => {
  return () =>
    Promise.resolve(`
    <html>
      <head></head>
      <body>
        <div id="content">
          <article id="post-12984" class="post-12984 post type-post status-publish format-standard hentry category-closures">
            <header class="entry-header">
              <h1 class="entry-title">
                <a href="https://edu.princeedwardisland.ca/psb/2019/10/17/all-after-school-student-activities-cancelled/" rel="bookmark">${mockArticleTitle}</a>
              </h1>
            </header>
        </div>
      </body>
    </html>
`);
});

let mockLastMatchedTitle: string;
jest.mock('./title-persistence', () => {
  return {
    getLastMatchedTitle: async () => mockLastMatchedTitle,
    setLastMatchedTitle: async (matchedTitle: string) =>
      (mockLastMatchedTitle = matchedTitle),
  };
});

describe('check-site-for-delay', () => {
  let checkSiteForDelay;

  beforeEach(() => {
    jest.resetModules();
    ({ checkSiteForDelay } = require('./check-site-for-delay'));
    mockLastMatchedTitle = undefined;
  });

  it('identifies a post about a delay', async () => {
    mockArticleTitle = 'All After-School Student Activities Cancelled';
    const actual = await checkSiteForDelay();

    expect(actual).toEqual({
      matchedArticleTitle: mockArticleTitle,
      newDelayOrCancellationDetected: true,
    });
  });

  it('does not identify any posts about delays', async () => {
    mockArticleTitle = 'Public Schools Branch Career-Job Fairs';
    const actual = await checkSiteForDelay();

    expect(actual).toEqual({
      newDelayOrCancellationDetected: false,
    });
  });

  it('does not return a match if a matching article title has already been reported', async () => {
    mockArticleTitle = 'All After-School Student Activities Cancelled';
    const firstRun = await checkSiteForDelay();
    const secondRun = await checkSiteForDelay();

    expect(firstRun).toEqual({
      matchedArticleTitle: mockArticleTitle,
      newDelayOrCancellationDetected: true,
    });

    expect(secondRun).toEqual({
      newDelayOrCancellationDetected: false,
    });
  });
});
