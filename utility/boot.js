import chalkAnimation from 'chalk-animation';
import wait from "./wait.js"
import { createSpinner } from 'nanospinner'

const boot = async () => {
  const chalkTitle = chalkAnimation.rainbow("Wikipedia CLI");
  const spinner = createSpinner();

  spinner.start({ text: "Loading", color: "cyan" });

  setTimeout(() => {
    spinner.success()
  }, 1000)

  await wait(1000);

  chalkTitle.stop();
  console.clear();
}

export default boot;