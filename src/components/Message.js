import BaseComponent from './BaseComponent';

export default class Message extends BaseComponent {
  showMessage(text) {
    super.show();
    this.element.innerText = text;
  }

  hideMessage() {
    super.hide();
  }
}
