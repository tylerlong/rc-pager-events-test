import RingCentral from '@rc-ex/core';
import WebSocketExtension from '@rc-ex/ws';

const rc = new RingCentral({
  clientId: process.env.RINGCENTRAL_CLIENT_ID!,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET!,
  server: process.env.RINGCENTRAL_SERVER_URL!,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.JWT!,
  });
  const wsExtension = new WebSocketExtension();
  await rc.installExtension(wsExtension);
  await wsExtension.subscribe(['/restapi/v1.0/account/~/extension/~/message-store'], (event) => {
    console.log(JSON.stringify(event));
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
main();
