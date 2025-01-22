class Foo {
  private $name: string
  constructor(_name: string) {
    this.$name = _name
  }

  public get name(): string {
    this.bar()
    return this.$name
  }

  private bar() {}
}

let a = new Foo('a')
// a.bar()

export default {}
