export default class Section {
  constructor(sectionEl) {
    this.section = sectionEl;
  }

  show() {
    this.section.classList.remove('hide');
  }

  hide() {
    this.section.classList.add('hide');
  }
}
