import View from './view.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const curPage = this._data.page;

    // Page 1 and there other pages
    if (curPage === 1 && numPages > 1) return this._generateMarkupBtn(curPage);

    // Last page
    if (curPage === numPages && numPages > 1)
      return this._generateMarkupBtn(curPage, 'prev');

    // Other pages
    if (curPage < numPages)
      return (
        this._generateMarkupBtn(curPage, 'prev') +
        this._generateMarkupBtn(curPage)
      );

    // Page 1 and no pages
    return '';
  }

  _generateMarkupBtn(curPage, prev = '') {
    return `
      <button data-goto="${
        prev ? curPage - 1 : curPage + 1
      }" class="btn--inline pagination__btn--${prev ? 'prev' : 'next'}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-${prev ? 'left' : 'right'}"></use>
          </svg>
        <span>Page ${prev ? curPage - 1 : curPage + 1}</span>
      </button>
    `;
  }
}

export default new PaginationView();
