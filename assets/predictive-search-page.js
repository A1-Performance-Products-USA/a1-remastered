class PredictiveSearchPage extends HTMLElement {
     constructor() {
          super();
          this.cachedResults = {};
          this.input = this.querySelector('input[type="search"]');

          this.setupEventListeners();
     }

     setupEventListeners() {
          const form = this.querySelector('form.search');
          form.addEventListener('submit', this.onFormSubmit.bind(this));

          this.input.addEventListener('input', debounce((event) => {
               this.onChange(event);
          }, 300).bind(this));
     }

     getQuery() {
          return this.input.value.trim();
     }

     onChange(event) {
          const searchTerm = this.getQuery();

          if (!searchTerm.length) {
               return;
          }

          this.getSearchResults(searchTerm, event);
     }

     onFormSubmit(event) {
          event.preventDefault();

          if (!searchTerm.length) {
               return;
          }
          
          this.onChange(event);
     }

     getSearchResults(searchTerm, event) {
          const queryKey = searchTerm.replace(" ", "-").toLowerCase();

          let newSearchParams = new URLSearchParams(window.location.search);
          newSearchParams.set('q', encodeURIComponent(searchTerm));
          newSearchParams.set('resources[type]', encodeURIComponent("product"));
          newSearchParams.set('resources[limit]', encodeURIComponent('48'));
          newSearchParams.set('resources[fields]', encodeURIComponent("variants.sku,title,product_type,vendor,variants.barcode"));

          if (this.cachedResults[queryKey]) {
               this.renderSearchResults(this.cachedResults[queryKey]);
               return;
          }

          FacetFiltersForm.renderPage(newSearchParams.toString(), event);
     }

     setLiveRegionLoadingState() {
          this.statusElement = this.statusElement || this.querySelector('.predictive-search-status');
          this.loadingText = this.loadingText || this.getAttribute('data-loading-text');

          this.setLiveRegionText(this.loadingText);
          this.setAttribute('loading', true);
     }

     renderSearchResults(resultsMarkup) {
          this.predictiveSearchResults.innerHTML = resultsMarkup;
          this.setAttribute('results', true);

          this.setLiveRegionResults();
          this.open();
     }

     setLiveRegionResults() {
          this.removeAttribute('loading');
          this.setLiveRegionText(this.querySelector('[data-predictive-search-live-region-count-value]').textContent);
     }
}

customElements.define('predictive-search-page', PredictiveSearchPage);
