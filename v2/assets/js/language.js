(() => document.querySelectorAll('[data-language]').forEach(link=>link.addEventListener('click',()=>localStorage.setItem('satona-v2-language',link.dataset.language))))();
