const popupLinks = document.querySelectorAll('.popup-link'); // все ссылки на объекты, по клику на которые будет открываться текущий попап
const body = document.querySelector('body');
const lockPadding = document.querySelectorAll('.lock-padding'); // нужно для фиксированных объектов (т.к. они фиксированны, то стили, которые присваиваем body во время выполнения функции на них не распространяются), чтобы они не сдвигались при открытии попапа (см. header)

let unlock = true; // нужна для того, чтобы не было двойных нажатий (см. popupOpen())

const timeout = 800; // такое же время, как у свойства transition в css

// вешаем события на объекты с классом .popup-link
if (popupLinks.length > 0) {
   for (let index = 0; index < popupLinks.length; index++) {
      const popupLink = popupLinks[index];
      popupLink.addEventListener('click', function (e) {
         const popupName = popupLink.getAttribute('href').replace('#', ''); // значение равное id попапа
         const currentPopup = document.getElementById(popupName);
         popupOpen(currentPopup);
         e.preventDefault(); // т.к. перебираемые объекты это ссылки
      });
   }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
   for (let index = 0; index < popupCloseIcon.length; index++) {
      const el = popupCloseIcon[index];
      el.addEventListener('click', function (e) {
         popupClose(el.closest('.popup'));
         e.preventDefault();
      });
   }
}

function popupOpen(currentPopup) {
   if (currentPopup && unlock) {
      // открытый попап
      const popupActive = document.querySelector('.popup.open');
      // если в попапе есть ссылка на еще один попап, то закрываем изначальный попап и при этом скролл не появляется (doUnlock = false)
      if (popupActive) {
         popupClose(popupActive, false);
      } else {
         bodyLock(); // если нет, то блочим скролл
      }
      currentPopup.classList.add('open');
      currentPopup.addEventListener('click', function (e) {
         // если у нажатого объекта нет в родителях объекта с классом .popup__content (т.е. любая область кроме попапа), то закрывай попап)
         if (!e.target.closest('.popup__content')) {
            popupClose(e.target.closest('.popup'));
         }
      });
   }
}

function popupClose(popupActive, doUnlock = true) {
   if (unlock) {
      popupActive.classList.remove('open');
      if (doUnlock) {
         bodyUnLock();
      }
   }
}

// скрываем скролл
function bodyLock() {
   // высчитываем разницу между шириной вьюпорта и объекта, который находится внутри него === 17px
   const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
   if (lockPadding.length > 0) {
      for (let index = 0; index < lockPadding.length; index++) {
         const el = lockPadding[index];
         // отменяем сдвиг контента на заднем фоне попапа
         el.style.paddingRight = lockPaddingValue;
      }
   }
   body.style.paddingRight = lockPaddingValue;
   body.classList.add('lock'); // overflow: hidden

   unlock = false; // лочим эту переменную, пока открывается попап (чтобы не было повторных нажатий во время открытия)
   setTimeout(() => {
      unlock = true;
   }, timeout); // 800
}

function bodyUnLock() {
   // setTimeout нужен для того, чтобы при закрытии скролл не появлялся моментально и не дергал сам попап
   setTimeout(() => {
      if (lockPadding.length > 0) {
         for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
         }
      }
      body.style.paddingRight = '0px';
      body.classList.remove('lock');
   }, timeout);

   unlock = false; // лочим эту переменную, пока закрывается попап (чтобы не было повторных нажатий во время закрытия)
   setTimeout(() => {
      unlock = true;
   }, timeout);
}

document.addEventListener('keydown', function (e) {
   if (e.which === 27) {
      const popupActive = document.querySelector('.popup.open');
      popupClose(popupActive);
   }
});

// полифилы (параметры под IE11)

(function () {
   // проверяем поддержку
   if (!Element.prototype.closest) {
      // реализуем
      Element.prototype.closest = function (css) {
         var node = this;
         while (node) {
            if (node.matches(css)) return node;
            else node = node.parentElement;
         }
         return null;
      };
   }
})();
(function () {
   // проверяем поддержку
   if (!Element.prototype.matches) {
      // определяем свойство
      Element.prototype.matches = Element.prototype.matchesSelector ||
         Element.prototype.webkitMatchesSelector ||
         Element.prototype.mozMatchesSelector ||
         Element.prototype.msMatchesSelector;
   }
})();