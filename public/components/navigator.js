const hide = (elements) => {
    elements.forEach((element) => {
       element.classList.add("hidden");
       element.classList.remove("visible");
    });
 }
 
 const show = (element) => {
    element.classList.add("visible");
    element.classList.remove("hidden");   
 }
 
 export const createNavigator = (parentElement) => {
    const pages = Array.from(parentElement.querySelectorAll(".page"));
    
    const render = () => {
       const url = new URL(document.location.href);
       const pageName = url.hash.replace("#", "");
       const selected = pages.filter((page) => page.id === pageName)[0] || pages[0];
 
       hide(pages);
       show(selected);
    }
    window.addEventListener('popstate', render); 
    render();   
 }