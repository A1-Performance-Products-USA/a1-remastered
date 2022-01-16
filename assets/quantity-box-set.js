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

          let oldValue = parseInt(this.input.value);
          let newValue = oldValue + 1;

          this.checkDisabled(oldValue, newValue);

          if (newValue > this.input.max) return;

          this.input.value = newValue;
          this.input.dispatchEvent(new Event('change'));
     }

     decrement(e) {
          e.preventDefault();

          if (e.currentTarget.classList.contains('disabled')) return;

          let oldValue = parseInt(this.input.value);
          let newValue = oldValue - 1;

          this.checkDisabled(oldValue, newValue);

          if (newValue < this.input.min) return;

          this.input.value = newValue;
          this.input.dispatchEvent(new Event('change'));
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

     disableAll() {
          this.input.disabled = true;
          this.input.classList.add('disabled');
          this.down.disabled = true;
          this.down.classList.add('disabled');
          this.up.disabled = true;
          this.up.classList.add('disabled');
     }

     enableAll() {
          this.input.disabled = false;
          this.down.disabled = false;
          this.up.disabled = false;

          this.inputOnChange();
     }
}

customElements.define('quantity-box-set', QuantityBoxSet);