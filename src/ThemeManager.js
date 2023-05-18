export default class ThemeManager {
  constructor() {
    this.themeSwitcher = document.getElementById('themeSwitcher');
  }

  init() {
    this.themeSwitcher.addEventListener('click', ThemeManager.toggleTheme);
    this.setInitialTheme();
  }

  static setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }

  static toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
      ThemeManager.setTheme('theme-light');
    } else {
      ThemeManager.setTheme('theme-dark');
    }
  }

  setInitialTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
      ThemeManager.setTheme('theme-dark');
      this.themeSwitcher.checked = false;
    } else {
      ThemeManager.setTheme('theme-light');
      this.themeSwitcher.checked = true;
    }
  }
}
