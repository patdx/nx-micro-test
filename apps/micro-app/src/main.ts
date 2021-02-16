import polka from 'polka';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { CONFIG } from '@nx-micro-test/config';
import pm2 from 'pm2';
import util, { promisify } from 'util';
import { memoize } from 'lodash';
import waitOn from 'wait-on';

console.log(CONFIG);

const getOrInitPm2 = memoize(async () => {
  console.log('connect to pm2');
  await new Promise<void>((resolve) => pm2.connect(true, () => resolve()));
});

const createAppMiddleware = (appName: string) => {
  return [
    async (req, res, next) => {
      console.log('starting pm2');
      await getOrInitPm2();
      console.log('ensuring app is started');

      const status = await promisify(pm2.describe.bind(pm2))(appName);

      if (
        status.filter((item) => item.pm2_env.status === 'online').length === 0
      ) {
        console.log(`starting ${appName}...`);
        await promisify(pm2.start.bind(pm2))({
          name: appName,
          script: `nx serve ${appName}`,
        } as any);
        console.log(`started ${appName}`);
        await (waitOn as any)({
          resources: [`http://localhost:${CONFIG[appName]}`],
        });
        console.log(`${appName} ready for requests`);
      } else {
        console.log('already started');
      }

      next();
    },
    createProxyMiddleware({
      target: `http://localhost:${CONFIG[appName]}`,
      logLevel: 'debug',
      changeOrigin: true,
    }),
  ];
};

polka()
  .use(
    '/example',
    createProxyMiddleware({
      target: 'http://www.example.org',
      changeOrigin: true,
    })
  )
  .use('/next-app', ...createAppMiddleware('next-app'))
  .use('/express-app', ...createAppMiddleware('express-app'))
  .listen(CONFIG['micro-app'], (err) => {
    if (err) throw err;
    console.log(`> Running on localhost:3000`);
  });
