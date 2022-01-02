class AddToCart extends HTMLElement {
     constructor() {
          super();
          
          this.form = this.querySelector('form');
          this.button = this.querySelector('button');

          this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
          this.cartNotification = document.querySelector('cart-notification');
     }

     onSubmitHandler(e) {
          //Prevent submission
          e.preventDefault();

          if (this.button.classList.contains('loading')) return;

          this.handleErrorMessage();
          this.cartNotification.setActiveElement(document.activeElement);

          this.button.setAttribute('aria-disabled', true);
          this.button.classList.add('loading');
          this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

          //send request for cart addition
          fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
               if (response.status) {
                    this.handleErrorMessage(response.description);
                    return;
               }

               this.cartNotification.renderContents(response);
          })
          .catch((e) => {
               console.error(e);
          })
          .finally(() => {
               this.button.classList.remove('loading');
               this.button.removeAttribute('aria-disabled');
               this.querySelector('.loading-overlay__spinner').classList.add('hidden');
          });

          //create info for card popup
          //place info for card popup into the div element
          //show the cart popup
          //remove cart popup after x time.
     }

     handleErrorMessage(errorMessage = false) {
          this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
          this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

          this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

          if (errorMessage) {
               this.errorMessage.textContent = errorMessage;
          }
     }
}

customElements.define('add-to-cart', AddToCart);

class QuantityBoxSet extends HTMLElement {
     constructor() {
          super();

          this.input = this.querySelector('input');
          this.up = this.querySelector('.qtyplus');
          this.down = this.querySelector('.qtyminus');

          this.up.addEventListener('click', this.increment.bind(this));
          this.down.addEventListener('click', this.decrement.bind(this));
          this.input.addEventListener('change', this.inputOnChange.bind(this));

          if (this.input.max <= this.input.value) {
               this.up.classList.add('disabled');
          }
          
          if (this.input.min >= this.input.value) {
               this.down.classList.add('disabled');
          }
     }

     checkDisabled(oldValue, newValue) {
          if (newValue > this.input.max) {
               this.up.classList.add('disabled');
          } else if (newValue == this.input.max) {
               this.up.classList.add('disabled');
          }

          if (newValue < this.input.min) {
               this.down.classList.add('disabled');
          } else if (newValue == this.input.min) {
               this.down.classList.add('disabled');
          } 
          
          if (oldValue == this.input.max && newValue < this.input.max) {
               this.up.classList.remove('disabled');
          }
          
          if (oldValue == this.input.min && newValue > this.input.min) {
               this.down.classList.remove('disabled');
          }
     }

     increment(e) {
          e.preventDefault();

          if (e.currentTarget.classList.contains('disabled')) return;

          console.log(parseInt(this.input.value));

          let oldValue = parseInt(this.input.value);
          let newValue = oldValue + 1;

          this.checkDisabled(oldValue, newValue);

          if (newValue > this.input.max) return;

          this.input.value = newValue;
     }

     decrement(e) {
          e.preventDefault();

          if (e.currentTarget.classList.contains('disabled')) return;

          let oldValue = parseInt(this.input.value);
          let newValue = oldValue + 1;

          this.checkDisabled(oldValue, newValue);

          if (newValue < this.input.min) return;

          this.input.value = newValue;
     }

     inputOnChange(e) {
          if (this.input.value + 1 >= this.input.max) {
               this.up.classList.add('disabled');
          }

          if (this.input.value - 1 <= this.input.min) {
               this.down.classList.add('disabled');
          }

          if (this.input.value > this.input.min) {
               this.down.classList.remove('disabled');
          }

          if (this.input.value < this.input.max) {
               this.up.classList.remove('disabled');
          }
     }
}

customElements.define('quantity-box-set', QuantityBoxSet);