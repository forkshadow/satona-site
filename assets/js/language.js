(() => document.querySelectorAll('[data-language]').forEach(link=>link.addEventListener('click',()=>localStorage.setItem('satona-language',link.dataset.language))))();
