import { CommandBase } from '../lib/command-base';

export class MockCommand extends CommandBase {
  constructor() {
    super();
    this.name = 'mock';
    this.description = 'this is a mock';
  }

  exec() {
    return 'this is a test';
  }
}
