import { Marked } from 'marked'
import { createDirectives } from 'marked-directive'
import { md5 } from 'md5'

async function main() {
  try {
    const labId = location.pathname
    const marked = new Marked().use(createDirectives())
    const md = await fetch(`${labId}.md`).then(res => res.text())
    document.body.innerHTML = marked.parse(md)

    const taskLists = document.querySelectorAll('.tasks');
    taskLists.forEach((tasksElement, index) => {
      // create a unique id for the tasklist
      const tasklistId = tasksElement.dataset["id"] || md5(tasksElement.textContent)

      // add unique ids to the tasks li-elements
      const tasks = tasksElement.querySelectorAll('li')
      tasks.forEach((task, index) => {
        task.id = `task-${tasklistId}-${index}`
      })

      // click event to toggle a task as done
      tasksElement.addEventListener('click', (e) => {
        let target = e.target
        while (target) {
          // break when we read the tasks container
          if (target === tasksElement) {
            return;
          }

          // toggle the class if the target is a list item in an ordered list
          if (target.parentElement?.tagName === 'OL') {
            const isSet = target.classList.toggle('done')
            const taskId = `${labId}-${target.id}`;
            if (isSet) {
              localStorage.setItem(taskId, "done")
            }
            else {
              localStorage.removeItem(taskId)
            }

            break;
          }

          // move to the parent element
          target = target.parentElement
        }
      })
    })

    // restore the state of the tasks
    const tasks = document.querySelectorAll('.tasks li')
    tasks.forEach((task) => {
      task.toolTip = "Click to toggle as done"
      if (localStorage.getItem(`${labId}-${task.id}`))
        task.classList.add('done')
    })
  }
  catch (e) {
  }
}

main()