class MobileMenu extends HTMLComponent {
     constructor() {
          super();
     }

     initializeOpeners() {
          document.querySelectorAll('.navigation-icon').forEach((e) => {
               e.addEventListener('click', this.toggleMenu.bind(this));
          })
     }

     toggleMenu() {

     }
}
customElements.define('mobile-menu', MobileMenu);