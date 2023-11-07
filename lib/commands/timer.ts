import { CommandBase, type CommandHandler } from "../command-base";

/**
 * タイマー機能
 */
export default class Timer extends CommandBase {
  constructor() {
    super();
    this.name = "timer";
    this.description = "`timer`: timer in seconds";
  }

  exec(): CommandHandler {
    return async (sendReplyMessage, ctx) => {
      const target = parseFloat(ctx.args[0]);
      const startAt = Date.now();
      const [updateReplyMessage] = await Promise.all([
        sendReplyMessage(`${target} sec`).then(({ updateReplyMessage }) => updateReplyMessage),
        new Promise<void>((resolve) => setTimeout(resolve, 1000)),
      ]);
      while (true) {
        const remainingTime = Math.round(target - (Date.now() - startAt) / 1000);
        await Promise.all([
          updateReplyMessage(`${Math.max(remainingTime, 0)} sec`),
          new Promise<void>((resolve) => setTimeout(resolve, 1000)),
        ]);
        if (remainingTime <= 0) {
          await updateReplyMessage("Done!");
          break;
        }
      }
    };
  }
}
