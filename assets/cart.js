class CartRemoveButton extends HTMLElement {
     constructor() {
          super();
          this.addEventListener('click', (event) => {
               event.preventDefault();
               this.closest('cart-items').updateQuantity(this.dataset.index, 0);
          });
     }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartItems extends HTMLElement {
     constructor() {
          super();

          this.lineItemStatusElement = document.getElementById('shopping-cart-line-item-status');

          this.currentItemCount = Array.from(this.querySelectorAll('[name="updates[]"]'))
               .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);

          this.debouncedOnChange = debounce((event) => {
               this.onChange(event);
          }, 300);

          this.addEventListener('change', this.debouncedOnChange.bind(this));

          this.initQuantity();
     }

     initQuantity() {
          this.querySelectorAll('quantity-box-set > input').forEach((element) => {
               element.addEventListener('change', this.debouncedOnChange.bind(this));
          })
     }

     onChange(event) {
          this.updateQuantity(event.target.dataset.index, event.target.value, document.activeElement.getAttribute('name'));
     }

     getSectionsToRender(line) {
          return [
               {
                    id: 'main-cart-items',
                    section: document.getElementById('main-cart-items').dataset.id,
                    selector: `#CartItems > tbody`,
               },
               {
                    id: 'header-cart',
                    selector: '.header-cart',
               },
               {
                    id: 'main-cart-footer',
                    section: document.getElementById('main-cart-items').dataset.id,
                    selector: '.subtotal-wrapper',
               }
          ];
     }

     updateQuantity(line, quantity, name) {
          const body = JSON.stringify({
               line,
               quantity,
               sections: this.getSectionsToRender(line).map((section) => section.section || section.id),
               sections_url: window.location.pathname
          });

          fetch(`${routes.cart_change_url}`, {
               ...fetchConfig(),
               ...{
                    body
               }
          })
          .then((response) => {
               return response.text();
          })
          .then((state) => {
               const parsedState = JSON.parse(state);
               this.classList.toggle('is-empty', parsedState.item_count === 0);
               const cartFooter = document.getElementById('main-cart-footer');

               if (cartFooter) cartFooter.classList.toggle('is-empty', parsedState.item_count === 0);

               this.getSectionsToRender(line).forEach((section => {
                    const elementToReplace =
                         document.getElementById(section.id).querySelector(section.selector) || document.getElementById(section.id);

                    elementToReplace.innerHTML =
                         this.getSectionInnerHTML(parsedState.sections[section.section || section.id], section.selector);
               }));

               this.initQuantity();
          }).catch(() => {
               document.getElementById('cart-errors').textContent = window.cartStrings.error;
          });
     }

     getSectionInnerHTML(html, selector) {
          return new DOMParser()
               .parseFromString(html, 'text/html')
               .querySelector(selector).innerHTML;
     }
}

customElements.define('cart-items', CartItems);