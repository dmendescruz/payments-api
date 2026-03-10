import { createServer } from './config/server';
import { env } from './config/env';

const app = createServer();

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on port ${env.port} [${env.nodeEnv}]`);
});

export default app;