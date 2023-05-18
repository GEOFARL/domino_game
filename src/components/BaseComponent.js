export default class BaseComponent {
  constructor(element) {
    this.element = element;
  }

  show() {
    this.element.classList.remove('hide');
  }

  hide() {
    this.element.classList.add('hide');
  }
}
