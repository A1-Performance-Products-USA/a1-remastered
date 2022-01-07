class MobileMenu extends HTMLElement {
     constructor() {
          super();

          if (window.innerWidth > LaptopScreenBreak) return;

          this.open = false;
          this.header = document.querySelector('header');

          this.catListTotalHeight = 0;

          this.initializeMenuToggles();
          this.initializeMenuItems();
     }

     initializeMenuToggles() {
          document.querySelectorAll('.navigation-icon').forEach((e) => {
               e.addEventListener('click', this.toggleMenu.bind(this));
          });
     }

     initializeMenuItems() {
          this.querySelectorAll('.menu-list li').forEach((e) => {
               e.addEventListener('click', this.openChildList.bind(this));
          });

          this.querySelectorAll('.go-back').forEach((e) => {
               e.addEventListener('click', this.closeChildList.bind(this));
          });
     }

     minimizeCounts() {
          const itemCount = 11;
          const gap = 3;
          const catList = this.querySelector('.store-categories');
          let listItems = Array.from(catList.querySelectorAll('li[data-parent="menu-list"]'));

          if (listItems.length <= itemCount) return;

          this.catListTotalHeight = catList.offsetHeight;

          let titleHeight = catList.querySelector('.title').offsetHeight;
          let heightPerRow = listItems[0].offsetHeight;
          let maxHeight = titleHeight + (heightPerRow * itemCount) + (gap * (itemCount + 1));

          catList.style.maxHeight = maxHeight + 'px';

          const seeMore = document.createElement('div');
          seeMore.classList.add('see-more');
          seeMore.innerHTML = '<i class="mdi mdi-chevron-double-down"></i>Show More<i class="mdi mdi-chevron-double-down"></i>';
          seeMore.addEventListener('click', this.expandCounts.bind(this));

          const referenceNode = catList.querySelector(`li[data-parent="menu-list"]:nth-child(${itemCount})`);

          referenceNode.after(seeMore);

          const seeLess = catList.querySelector('.see-less');
          if (seeLess) seeLess.parentNode.removeChild(seeLess);
     }

     expandCounts() {
          const catList = this.querySelector('.store-categories');
          catList.style.maxHeight = null;

          const seeMore = catList.querySelector('.see-more');
          seeMore.parentNode.removeChild(seeMore);

          const seeLess = document.createElement('div');
          seeLess.classList.add('see-less');
          seeLess.innerHTML = '<i class="mdi mdi-chevron-double-up"></i>Show Less<i class="mdi mdi-chevron-double-up"></i>';
          seeLess.addEventListener('click', this.minimizeCounts.bind(this));

          const referenceNode = catList.querySelector(`li[data-parent="menu-list"]:last-child`);
          referenceNode.after(seeLess);
     }

     fadeIn(e) {
          if (!e) e = this;
          e.style.display = 'block';
          e.style.opacity = 0;

          const fade = () => {
               var val = parseFloat(e.style.opacity);
               if (!((val += .1) > 1)) {
                    e.style.opacity = val;
                   requestAnimationFrame(fade);
               }
          }
          fade();
     }

     fadeOut(e, cback) {
          if (!e) e = this;
          e.style.display = 'block';
          e.style.opacity = 1;

          const fade = () => {
               if ((e.style.opacity -= .1) < 0) {
                    e.style.display = 'none';
                    e.style.opacity = 1;
                    if (cback) cback(e);
               } else {
                   requestAnimationFrame(fade);
               }
          }

          fade();
     }

     toggleMenu() {
          if (this.open) {
               //close
               this.header.classList.remove('mobile-open');
               this.fadeOut(this, (e) => {
                    e.classList.remove('open');
               });
               this.open = false;
          } else {
               //open
               this.header.classList.add('mobile-open');
               this.fadeIn();
               this.classList.add('open');
               this.open = true;

               this.minimizeCounts();
          }
     }

     openChildList(e) {
          if (!e.currentTarget.dataset.child) return;

          const target = e.currentTarget;
          const currentList = document.getElementById(target.dataset.parent);
          const newList = document.getElementById(target.dataset.child);

          console.log(target);
          console.log(currentList);
          console.log(newList);
          
          if (!newList || !currentList) return;

          newList.classList.add('open');
     }

     closeChildList(e) {
          if (!e.currentTarget.dataset.child) return;

          const target = e.currentTarget;
          const currentList = document.getElementById(target.dataset.child) || target.closest('ul');
          const newList = document.getElementById(target.dataset.parent);

          this.fadeOut(currentList, (e) => {
               e.classList.remove('open');
          });
     }
}
customElements.define('mobile-menu', MobileMenu);