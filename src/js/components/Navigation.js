import $ from 'jquery';

class Navigation {
  constructor() {
    console.log('Hello world');
    this.init();
  }

  init() {
    $(document).on('click', () => this.displayMessage());
  }

  displayMessage() {
    this.anotherMethod();
    alert('Hello jquery world!');
  }

  anotherMethod() {
    console.log('Another method should call');
  }
}

export default Navigation;
