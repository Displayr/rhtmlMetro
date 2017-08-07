
class rhtmlMetroDependency {
  constructor () {
    console.log('rhtmlMetroDependency constructor')
    this.foo = 'x'
  }

  doThings () {
    return this.foo
  }
}

module.exports = rhtmlMetroDependency
