(()=>{
  const KEY='satonaAcademyProgress';
  const empty=()=>({opened:[],completed:[],quizzes:[],finalQuiz:null});
  const read=()=>{try{return {...empty(),...JSON.parse(localStorage.getItem(KEY))}}catch{return empty()}};
  const write=value=>localStorage.setItem(KEY,JSON.stringify(value));
  const state=read();
  const page=document.body.dataset.lesson;
  if(page&&!state.opened.includes(page)){state.opened.push(page);write(state)}

  document.querySelectorAll('[data-progress]').forEach(el=>{
    const course=el.dataset.progress,total=Number(el.dataset.total);
    const done=state.completed.filter(id=>id.startsWith(`${course}:`)).length;
    const percent=Math.round(done/total*100);
    el.style.setProperty('--progress',`${percent}%`);el.setAttribute('aria-label',`${done} / ${total} (${percent}%)`);
    const label=el.parentElement?.querySelector('[data-progress-label]');if(label)label.textContent=`${percent}% · ${done}/${total} ${label.textContent}`;
  });
  document.querySelectorAll('[data-complete]').forEach(btn=>{
    const id=btn.dataset.complete;
    if(state.completed.includes(id)){btn.textContent=btn.dataset.done;btn.disabled=true}
    btn.addEventListener('click',()=>{if(!state.completed.includes(id))state.completed.push(id);write(state);btn.textContent=btn.dataset.done||'Completed';btn.disabled=true;document.dispatchEvent(new CustomEvent('academy:progress'))})
  });
  document.querySelectorAll('[data-quiz-answer]').forEach(btn=>btn.addEventListener('click',()=>{
    const quiz=btn.closest('[data-quiz]');quiz.querySelectorAll('[data-quiz-answer]').forEach(option=>{option.classList.remove('is-selected');option.setAttribute('aria-pressed','false')});
    btn.classList.add('is-selected');btn.setAttribute('aria-pressed','true');const ok=btn.dataset.quizAnswer==='true';
    quiz.querySelector('.quiz-result').textContent=ok?quiz.dataset.correct:quiz.dataset.wrong;
    if(ok&&!state.quizzes.includes(quiz.id)){state.quizzes.push(quiz.id);write(state)}
  }));
  document.querySelector('[data-reset]')?.addEventListener('click',event=>{if(confirm(event.currentTarget.dataset.confirm)){localStorage.removeItem(KEY);location.reload()}});
  document.querySelectorAll('.academy img').forEach(img=>img.addEventListener('error',()=>img.hidden=true));
  const reveals=document.querySelectorAll('.reveal');if(!('IntersectionObserver'in window)){reveals.forEach(el=>el.classList.add('is-visible'));return}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{rootMargin:'0px 0px -8%'});reveals.forEach(el=>observer.observe(el));
})();
