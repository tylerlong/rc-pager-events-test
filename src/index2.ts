import { SDK } from '@ringcentral/sdk';
import { Subscriptions } from '@ringcentral/subscriptions';
import RingCentral from '@rc-ex/core';

const main = async () => {
  const rcsdk = new SDK({
    server: process.env.RINGCENTRAL_SERVER_URL,
    clientId: process.env.RINGCENTRAL_CLIENT_ID,
    clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  });
  const platform = rcsdk.platform();
  await platform.login({ jwt: process.env.JWT });

  const subscriptions = new Subscriptions({
    sdk: rcsdk,
  });
  const subscription = subscriptions.createSubscription();
  subscription.on(subscription.events.notification, async (msg) => {
    console.log(JSON.stringify(msg));
    console.log('======');
  });
  await subscription.setEventFilters(['/restapi/v1.0/account/~/extension/~/message-store']).register();
};
main();

const trigger = async () => {
  const rc = new RingCentral({
    clientId: process.env.RINGCENTRAL_CLIENT_ID!,
    clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
    server: process.env.RINGCENTRAL_SERVER_URL!,
  });
  await rc.authorize({
    jwt: process.env.JWT!,
  });
  setInterval(async () => {
    await rc
      .restapi()
      .account()
      .extension()
      .companyPager()
      .post({
        from: {
          extensionId: rc.token!.owner_id,
        },
        to: [
          {
            extensionId: rc.token!.owner_id,
          },
        ],
        text: 'Hello world',
      });
  }, 10000);
};
trigger();
