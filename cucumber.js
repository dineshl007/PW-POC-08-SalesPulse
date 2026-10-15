module.exports = {
  default: {
    require: [
      'support/hooks.js',
      'step-definitions/**/*.js'
    ],
    format: [
      'progress',
      'html:reports/cucumber-report.html'
    ],
    publishQuiet: true
  }
};