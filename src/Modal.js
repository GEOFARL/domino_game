export default class Modal {
  constructor(modal, overlay) {
    this.modal = modal;
    this.overlay = overlay;
  }

  show() {
    this.overlay.classList.remove('hide');
    this.modal.classList.remove('hide');
  }

  hide() {
    this.overlay.classList.add('hide');
    this.modal.classList.add('hide');
  }
}
