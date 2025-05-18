import { ToUppercasePipe } from './touppercase.pipe';

describe('ToUppercasePipe', () => {
  it('create an instance', () => {
    const pipe = new ToUppercasePipe();
    expect(pipe).toBeTruthy();
  });
});
