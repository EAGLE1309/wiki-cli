import wiki from 'wikijs';
import { createSpinner } from 'nanospinner'

const spinner = createSpinner();

const search = (query) => wiki()
  .page(query)
  .then(async (page) => {
    await spinner.start({ text: "Searching...", color: "green" });
    const content = await page.summary()
    const details = await page.fullInfo()
    await spinner.success({ text: `Search results for ${query}`, color: "green" });
    return {
      content,
      details
    }
  })

export { search };