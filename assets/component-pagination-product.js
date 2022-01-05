class ProductPagination extends HTMLElement {
     constructor() {
          super();

          this.prev = this.querySelector('.prev');
          this.next = this.querySelector('.next');

          this.links = Array.from(this.querySelectorAll('.pagination__item.link'));

          this.onClickAction = this.onClickAction || this.onClickAction.bind(this);

          if (this.prev) {
               this.prev.addEventListener('click', this.onClickAction);
          }

          if (this.next) {
               this.next.addEventListener('click', this.onClickAction);
          }

          this.links.forEach((element) => {
               element.addEventListener('click', this.onClickAction);
          });
     }

     onClickAction(event) {
          event.preventDefault();

          const getOffset = ( el ) => {
               var _x = 0;
               var _y = 0;
               while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
                   _x += el.offsetLeft - el.scrollLeft;
                   _y += el.offsetTop - el.scrollTop;
                   el = el.offsetParent;
               }
               return { top: _y, left: _x };
          }
          window.scroll({
               top: getOffset(document.querySelector('.breadcrumb')).top,
               behavior: 'smooth'
          });

          const url = new URL(event.currentTarget.href);
          const searchParams = new URLSearchParams(url.search);

          FacetFiltersForm.renderPage(searchParams.toString(), event);
     }
}

customElements.define('product-pagination', ProductPagination);
