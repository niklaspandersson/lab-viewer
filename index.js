import { parse } from 'marked';

async function main() {
  try {
    const md = await fetch(`${location.pathname}.md`).then(res => res.text());
    document.body.innerHTML = parse(md);
  }
  catch (e) {
  }
}

function listenForOrderedListClicks() {
  document.body.addEventListener('click', (e) => {
    let target = e.target;
    while (target) {
      while (target && target.tagName !== 'LI') {
        target = target.parentElement;
      }
      if (target && target?.parentElement.tagName === 'OL') {
        target.classList.toggle('done');
        break;
      }
      else {
        target = target?.parentElement;
      }
    }
  });
}

listenForOrderedListClicks();

main()