const Configstore = require(`configstore`)
const prompts = require(`prompts`)
const report = require(`../reporter`)

let conf
try {
  conf = new Configstore(`gatsby`, {}, { globalConfigPath: true })
} catch (e) {
  // This should never happen (?)
  conf = {
    settings: {
      "cli.packageManager": undefined,
    },
    get: key => conf.settings[key],
    set: (key, value) => (conf.settings[key] = value),
  }
}

const packageMangerConfigKey = `cli.packageManager`
exports.getPackageManager = () => conf.get(packageMangerConfigKey)
const setPackageManager = packageManager => {
  conf.set(packageMangerConfigKey, packageManager)
  report.info(`Preferred package manager set to "${packageManager}"`)
}
exports.setPackageManager = setPackageManager

exports.promptPackageManager = async () => {
  const promptsAnswer = await prompts([
    {
      type: `select`,
      name: `package_manager`,
      message: `Which package manager would you like to use ?`,
      choices: [
        { title: `yarn`, value: `yarn` },
        { title: `npm`, value: `npm` },
      ],
      initial: 0,
    },
  ])
  const response = promptsAnswer.package_manager
  if (response) {
    setPackageManager(response)
  }
  return response
}
