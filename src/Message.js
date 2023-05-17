export default class Message {
  constructor(messageEl) {
    this.message = messageEl;
  }

  show(text) {
    this.message.classList.toggle('hide');
    this.message.innerText = text;
  }

  hide() {
    this.message.classList.toggle('hide');
  }
}
