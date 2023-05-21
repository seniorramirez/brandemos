import Toastify from "toastify-js";
import dom from "@left4code/tw-starter/dist/js/dom";

const toastifyClass = "_" + Math.random().toString(36).substr(2, 9);

const init = (el, props) => {
  el.showToast = (message,title) => {
    const clonedEl = dom(el).clone().removeClass("hidden")[0];

    clonedEl.innerHTML = clonedEl.innerHTML.replace('__title__',title).replace('__content__',message);


    dom(clonedEl).addClass(toastifyClass);
    clonedEl.toastify = Toastify({
      duration: -1,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      ...props.options,
      node: clonedEl,
      duration: 3000,
    }).showToast();

    dom(clonedEl).on("click", "[data-dismiss='notification']", function () {
      clonedEl.toastify.hideToast();
    });
  };

  el.hideToast = () => {
    dom(`.${toastifyClass}`).each(function () {
      dom(this)[0].toastify.hideToast();
    });
  };
};

const reInit = (el) => {
  dom(`.${toastifyClass}`).html(dom(el).html());
};

export { init, reInit };
