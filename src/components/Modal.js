import BaseComponent from './BaseComponent';

export default class Modal extends BaseComponent {
  constructor(modal, overlay) {
    super(modal);
    this.overlay = overlay;
  }

  show() {
    this.overlay.classList.remove('hide');
    super.show();
  }

  hide() {
    this.overlay.classList.add('hide');
    super.hide();
  }
}
