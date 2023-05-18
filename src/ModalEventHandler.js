export default class ModalEventHandlers {
  constructor(ui) {
    this.ui = ui;
    this.closeModalBtn = document.querySelector('.modal__header svg');
    this.closeModalInfoBtn = document.querySelector('.modal__info svg');
  }

  init() {
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalInfoClose = this.handleModalInfoClose.bind(this);

    this.closeModalBtn.addEventListener('click', this.handleModalClose);
    this.closeModalInfoBtn.addEventListener('click', this.handleModalInfoClose);
  }

  handleModalClose() {
    this.ui.hideModal('error');
  }

  handleModalInfoClose() {
    this.ui.hideModal('info');
  }
}
