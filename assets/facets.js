class FacetFiltersForm extends HTMLElement {
     constructor() {
          super();
          this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

          this.debouncedOnSubmit = debounce((event) => {
               this.onSubmitHandler(event);
          }, 500);

          this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));

          this.querySelector('form').onSubmitHandler = this.onSubmitHandler.bind(this);

          const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
          if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);
     }

     static setListeners() {
          const onHistoryChange = (event) => {
               const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
               if (searchParams === FacetFiltersForm.searchParamsPrev) return;
               FacetFiltersForm.renderPage(searchParams, null, false);
          }
          window.addEventListener('popstate', onHistoryChange);
     }

     static toggleActiveFacets(disable = true) {
          document.querySelectorAll('.js-facet-remove').forEach((element) => {
               element.classList.toggle('disabled', disable);
          });
     }

     static renderPage(searchParams, event, updateURLHash = true) {
          FacetFiltersForm.searchParamsPrev = searchParams;
          const sections = FacetFiltersForm.getSections();
          const countContainer = document.getElementById('product-count-wrapper');
          const countContainerDesktop = document.getElementById('ProductCountDesktop');
          
          document.getElementById('ProductGridContainer').querySelector('.collection').classList.add('loading');

          if (countContainer) {
               countContainer.classList.add('loading');
          }
          if (countContainerDesktop) {
               countContainerDesktop.classList.add('loading');
          }

          sections.forEach((section) => {
               const url = `${window.location.pathname}?${searchParams}`;
               const filterDataUrl = element => element.url === url;

               FacetFiltersForm.filterData.some(filterDataUrl) ?
                    FacetFiltersForm.renderSectionFromCache(filterDataUrl, event) :
                    FacetFiltersForm.renderSectionFromFetch(url, event);
          });

          if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
     }

     static renderSectionFromFetch(url, event) {
          fetch(url)
               .then(response => response.text())
               .then((responseText) => {
                    const html = responseText;
                    FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
                    FacetFiltersForm.renderFilters(html, event);
                    FacetFiltersForm.renderProductGridContainer(html);
                    FacetFiltersForm.renderProductCount(html);
               });
     }

     static renderSectionFromCache(filterDataUrl, event) {
          const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
          FacetFiltersForm.renderFilters(html, event);
          FacetFiltersForm.renderProductGridContainer(html);
          FacetFiltersForm.renderProductCount(html);
     }

     static renderProductGridContainer(html) {
          document.getElementById('ProductGridContainer').innerHTML = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer').innerHTML;
     }

     static renderProductCount(html) {
          const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCountDesktop').innerHTML
          const container = document.getElementById('product-count-wrapper');
          const containerDesktop = document.getElementById('ProductCountDesktop');

          container.classList.remove('loading');

          if (containerDesktop) {
               containerDesktop.innerHTML = count;
               containerDesktop.classList.remove('loading');
          }
     }

     static renderFilters(html, event) {
          const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

          const facetDetailsElements = parsedHTML.querySelectorAll('#FacetFiltersForm .js-filter');

          const matchesIndex = (element) => {
               const jsFilter = event ? event.target.closest('.js-filter') : undefined;
               return jsFilter ? element.dataset.index === jsFilter.dataset.index : false;
          }

          const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
          const titleToRender = Array.from(facetDetailsElements).find(matchesIndex);

          facetsToRender.forEach((element) => {
               document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
          });

          FacetFiltersForm.renderActiveFacets(parsedHTML);
          FacetFiltersForm.renderAdditionalElements(parsedHTML);

          if (titleToRender) FacetFiltersForm.renderFilter(titleToRender, event.target.closest('.js-filter'));
     }

     static renderActiveFacets(html) {
          const activeFacetElementSelectors = ['.active-facets-desktop'];

          activeFacetElementSelectors.forEach((selector) => {
               const activeFacetsElement = html.querySelector(selector);
               if (!activeFacetsElement) return;
               document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
          })

          FacetFiltersForm.toggleActiveFacets(false);
     }

     static renderAdditionalElements(html) {
          const mobileElementSelectors = ['.sort-options'];

          mobileElementSelectors.forEach((selector) => {
               if (!html.querySelector(selector)) return;
               document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
          });
     }

     static renderFilter(source, target) {
          const titleTarget = target.querySelector('.filter-title');
          const titleSource = source.querySelector('.filter-title');

          if (titleTarget && titleSource) {
               target.querySelector('.filter-title').outerHTML = source.querySelector('.filter-title').outerHTML;
          }

          const optionTarget = target.querySelector('.filter-items');
          const optionSource = source.querySelector('.filter-items');

          if (optionTarget && optionSource) {
               console.log('here')
               target.querySelector('.filter-items').outerHTML = source.querySelector('.filter-items').outerHTML;
               
               if (target.querySelector('.filter-items').classList.contains('price-range') && target.querySelector('.price-tags')) {
                    target.querySelector('.price-tags').initializeOrder();
               }
          }
     }

     static updateURLHash(searchParams) {
          history.pushState({
               searchParams
          }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
     }

     static getSections() {
          return [
               {
                    section: document.getElementById('product-grid').dataset.id,
               }
          ]
     }

     onSubmitHandler(event) {
          event.preventDefault();
          const formData = new FormData(event.target.closest('form') || event.target.form);
          const searchParams = new URLSearchParams(formData).toString();
          FacetFiltersForm.renderPage(searchParams, event);
     }

     onActiveFilterClick(event) {
          event.preventDefault();
          FacetFiltersForm.toggleActiveFacets();
          const url = event.currentTarget.href.indexOf('?') == -1 ? '' : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
          FacetFiltersForm.renderPage(url);
     }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
     constructor() {
          super();
          this.querySelectorAll('input')
               .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));

          this.setMinAndMaxValues();
     }

     onRangeChange(event) {
          this.adjustToValidValues(event.currentTarget);
          this.setMinAndMaxValues();
     }

     setMinAndMaxValues() {
          const inputs = this.querySelectorAll('input');
          const minInput = inputs[0];
          const maxInput = inputs[1];
          if (maxInput.value) minInput.setAttribute('max', maxInput.value);
          if (minInput.value) maxInput.setAttribute('min', minInput.value);
          if (minInput.value === '') maxInput.setAttribute('min', 0);
          if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
     }

     adjustToValidValues(input) {
          const value = Number(input.value);
          const min = Number(input.getAttribute('min'));
          const max = Number(input.getAttribute('max'));

          if (value < min) input.value = min;
          if (value > max) input.value = max;
     }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
     constructor() {
          super();
          this.querySelector('a').addEventListener('click', (event) => {
               event.preventDefault();
               const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
               form.onActiveFilterClick(event);
          });
     }
}

customElements.define('facet-remove', FacetRemove);

class PriceTags extends HTMLElement {
     constructor() {
          super();
          
          this.initializeOrder();
     }

     initializeOrder() {
          const items = Array.from(this.querySelectorAll('.facets__item'));

          let sortedItems = items.sort((a,b) => (parseInt(a.dataset.index) > parseInt(b.dataset.index)) ? 1 : ((parseInt(b.dataset.index) > parseInt(a.dataset.index)) ? -1 : 0));
     
          let newInnerHtml = '';
         sortedItems.map((element) => {
               newInnerHtml += element.outerHTML;
          });

          this.querySelector('.price-range').innerHTML = newInnerHtml;
     }
}

customElements.define('price-tags', PriceTags);

class FilterOption extends HTMLElement {
     constructor() {
          super();
          
          let maxHeight = parseInt(this.offsetHeight) + 15;

          this.style.maxHeight = this.offsetHeight + 'px';

          this.label = this.querySelector('.dropdown-label');
          
          if (this.querySelector('.price-filters')) {
               this.price = true;
               this.priceFilters = Array.from(this.querySelectorAll('.price-filters'));
          } else {
               this.price = false;
               this.filterItems = Array.from(this.querySelectorAll('.filter-items'));
          }

          if (window.innerWidth <= LaptopScreenBreak) {
               this.label.querySelector('i').classList.remove('mdi-menu-up');
               this.label.querySelector('i').classList.add('mdi-menu-down');

               this.classList.remove('open');
               this.classList.add('closed');

               if (this.price) {
                    this.priceFilters.forEach((element) => {
                         $(element).hide();
                    });
               } else {
                    this.filterItems.forEach((element) => {
                         $(element).hide();
                    });
               }
          }

          this.label.addEventListener('click', this.toggle.bind(this));
     }

     changeOpenStatus() {
          if (this.classList.contains('open')) {
               this.classList.remove('open');
               this.classList.add('closed');

               this.label.querySelector('i').classList.remove('mdi-menu-up');
               this.label.querySelector('i').classList.add('mdi-menu-down');
          } else {
               this.classList.remove('closed');
               this.classList.add('open');

               this.label.querySelector('i').classList.remove('mdi-menu-down');
               this.label.querySelector('i').classList.add('mdi-menu-up');
          }
     }

     toggle(e) {
          e.preventDefault();

          if (this.price) {
               $(this.priceFilters).slideToggle(400, () => {
                    this.changeOpenStatus();
               });
          } else {
               $(this.filterItems).slideToggle(400, () => {
                    this.changeOpenStatus();
               });
          }
     }
}

customElements.define('filter-option', FilterOption);

class CategoryDropdown extends HTMLElement {
     constructor() {
          super();
          
          this.querySelector('.cat-title').addEventListener('click', this.clickAction.bind(this))
     }

     clickAction(event, target) {
          if (!event && !target) return;
          
          const childTarget = (event) ? event.currentTarget.dataset.child : target.dataset.child;

          if (!this.classList.contains('extended')) {
               this.querySelector('.cat-title .cat-menu-expand').innerHTML = '-';
          } else {
               this.querySelector('.cat-title .cat-menu-expand').innerHTML = '+';
          }

          $(this.querySelector('#' + childTarget)).slideToggle(400, () => {
               if (!this.classList.contains('extended')) {
                    this.classList.add('extended');
               } else {
                    this.classList.remove('extended');
               }
          });
     }
}

customElements.define('category-dropdown', CategoryDropdown);
