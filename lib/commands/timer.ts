import { CommandBase, type CommandHandler } from "../command-base";

/**
 * タイマー機能
 */
export default class Text2Image extends CommandBase {
  constructor() {
    super();
    this.name = "timer";
    this.description = "`timer`: timer in seconds";
  }

  exec(): CommandHandler {
    return async ({ args, editMessage }) => {
      const target = parseFloat(args[0]);
      const startAt = Date.now();
      while (true) {
        const remainingTime = Math.round(
          target - (Date.now() - startAt) / 1000
        );
        await Promise.all([
          editMessage(`${Math.max(remainingTime, 0)} sec`),
          new Promise<void>((resolve) => setTimeout(resolve, 1000)),
        ]);
        if (remainingTime <= 0) {
          await editMessage("Done!");
          break;
        }
      }
    };
  }
}
