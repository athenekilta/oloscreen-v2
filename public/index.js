// Week number code from https://weeknumber.com/how-to/javascript

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
  var date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
Date.prototype.getWeekYear = function () {
  var date = new Date(this.getTime());
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  return date.getFullYear();
}
// End of public domain code

let $ = document.querySelector.bind(document)
let $$ = document.querySelectorAll.bind(document)

document.addEventListener('DOMContentLoaded', async () => {

  // Get time until midnight
  let midnight = () => {
    return new Date().setHours(24, 0, 0, 0) - new Date()
  }

  let loadSponsorLogos = async () => {
    // Fetch logos from API
    let links = await (await fetch('logo-links/')).json()
    links.forEach((x) => {
      let img = document.createElement('img')
      img.src = x
      $('#logos').appendChild(img)
    })
    let container = $('#logos')
    let logos = $$('#logos img')

    // Hide logos on resize to prevent erratic movement
    let fadeTimeout;
    window.addEventListener('resize', () => {
      window.clearTimeout(fadeTimeout)
      container.classList.remove('fade-in')
      container.style.opacity = 0
      fadeTimeout = window.setTimeout(() => {
        container.classList.add('fade-in')
        container.style.opacity = 1
      }, 200)
    })


    // Scroll logos
    let animation = (ms) => {
      let containerSize = container.offsetWidth
      logos.forEach((x, i) => {
        let elementWidth = x.offsetWidth * 1.25
        let position = (ms * 0.00005 * window.innerWidth + (logos.length - i) * elementWidth) %
          (elementWidth * logos.length) - elementWidth
        if (position < containerSize) {
          if (x.style.visibility === 'hidden') x.style.visibility = 'visible'
          // Translate3d is hardware accelerated
          x.style.transform = `translate3d(${-position}px,0,0)`
        } else if (x.style.visibility !== 'hidden') x.style.visibility = 'hidden'
      })

      // Scroll elements with class "scrolling"
      let scrollingElements = $$('.scrolling')
      scrollingElements.forEach((el) => {
        let animationStarted = el.dataset.animationStarted
        let maxScroll = el.scrollHeight - el.offsetHeight
        // Don't animate if element can't be scrolled
        if (maxScroll <= 0) return
        if (!animationStarted || animationStarted === '0') {

          // Set animation start time
          el.dataset.animationStarted = ms
          el.scrollTop = 0

        } else if(animationStarted > 0) {
          // Animation takes 2 * delay + pixels / speed milliseconds 
          let speed = 0.05
          let delay = 2000
          let duration = maxScroll / speed
          let timeElapsed = (ms - animationStarted) % (2 * (delay + duration))
          let animationTime = timeElapsed < delay ? 0 :
            timeElapsed < delay + duration ? timeElapsed - delay :
            timeElapsed < 2 * delay + duration ? duration :
            2 * (delay + duration) - timeElapsed

            // nicely broken
            // let quadraticEaseInOut = (t, duration, maxScroll, maxAccelTime) => {
            //   let accelTime = Math.min(duration / 2, maxAccelTime)
            //   let accelDistance = accelTime / duration * maxScroll
            //   let accel = accelDistance / accelTime
            //   // Calculate required velocity to reach maxScroll / 2 in duration / 2 - accelTime
            //   if ((maxScroll / 2 - accelDistance) < 0) throw new Error('maxScroll too smol')
            //   let maxVelocity = (maxScroll / 2 - accelDistance) / (duration / 2 - accelTime)
            //   if (t < accelTime) return accel * t ** 2 / 2
            //   else if (t <= duration / 2) return maxVelocity * (t - accelTime) + accelDistance
            //   else return maxScroll - quadraticEaseInOut(duration - t, duration, maxScroll, maxAccelTime)
            // }

          const quadraticEaseInOut = (t, duration, maxScroll, maxAccelTime) => {
            let Ta = Math.min(duration / 2, maxAccelTime)
            let a = maxScroll / (2 * Ta * (duration - Ta))
            let linearVelocity = 2 * a * Ta
            let accelDistance = a * Ta ** 2

            if (t < Ta) return a * t ** 2
            else if (t <= duration / 2) return linearVelocity * (t - Ta) + accelDistance
            else return maxScroll - quadraticEaseInOut(duration - t, duration, maxScroll, maxAccelTime)
          }

          // Use quadratic easing function
          el.scrollTop = quadraticEaseInOut(animationTime, duration, maxScroll, 1000)
          s = ""
          for (let i = 0; i < el.scrollTop / maxScroll * 50; i++) {
            s += "#"
          }
        }
      })

      window.requestAnimationFrame(animation)
    }
    window.requestAnimationFrame(animation)
  }


  // Update time and date
  let timeAndDate = () => {
    let d = new Date()
    $('#time').innerText = d.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    $('#day').innerText = d.toLocaleDateString('fi-FI', { weekday: 'long' })
    $('#date').innerText = d.toLocaleDateString('fi-FI', { day: 'numeric', month: 'numeric' })
    $('#week').innerText = d.getWeek()
  }


  // Load restaurant menus
  let updateMenus = async () => {
    try {
      let restaurants = await (await fetch('restaurants/')).json()
      Object.entries(restaurants).forEach(([name, o]) => {
        let container = $(`#${name}`)
        let d = new Date()
        container.querySelector('.opening-hours').innerText = o.openingHours[(d.getDay() + 6) % 7] || 'suljettu'
        let categories = {}
        o.menus.forEach((x) => {
          let category = (x.title.match(/^(.+): /) || ['', ''])[1]
          if (!categories[category]) categories[category] = []
          categories[category].push(x)
        })
  
        let html = ''
        
        // Map through categories and their items
        Object.entries(categories).map((x) => {
          let allowGrouping = x[1].length > 1 && x[0] !== ''
          if (allowGrouping) {
            // Add category title if grouping is allowed
            html += `<h3>${x[0]}</h3>`
          }
          // Loop through items in category
          x[1].forEach((y) => {
            // Remove allergens from properties for better readability
            let properties = y.properties.filter((x) => !x.match(/\+/))
            if (allowGrouping) {
              // Add item title without category if grouping is allowed
              html += `<p class="light">${ y.title.slice(x[0].length + 2) }`
            } else {
              // Add item title with category if grouping is not allowed
              html += `<p class="light">${ y.title }`
            }
            // Add properties (special diets) if they exist
            if (properties.length > 0) html += `\n<span class="properties">${properties.join(' ')}</span>`
            html += `</p>`
          })
        })
        container.querySelector('.menu').innerHTML = html

      })
    } catch (error) {
      console.error(error)
      return error
    } finally {
      // Update menus every 4 hours and at midnight
      window.setTimeout(updateMenus, Math.min(midnight(), 4 * 60 * 60 * 1000))
    }
  }

  let formatDate = (date) => {
    return date.toLocaleDateString('fi-FI', { month: 'numeric', weekday: 'short', day: 'numeric' })
  }

  let formatTime = (date) => {
    return date.getUTCHours() === 0 && date.getUTCMinutes() === 0 ? '' :
      `klo ${date.toLocaleTimeString('fi-FI', { hour: 'numeric', minute: '2-digit' })}`
  }

  let formatDateTime = (date) => {
    return `${formatDate(date)} ${formatTime(date)}`
  }

  let formatEvent = (event) => {
    let date = new Date(event.startdt)
    let dateTime = formatDateTime(date)
    let location = event.location ? `@ ${event.location}` : ''
    let description = event.description ? `<div class="description">${event.description}</div>` : ''
    return `<div class="event">
      <div class="meta">${dateTime} ${location}</div>
      <div class="title">${event.summary}</div>
      ${description}
    </div>`
  }

  let updateCalendar = async () => {
    try {
      let calendar = await (await fetch('calendar/')).json()
      let container = $('#events > div')
      container.innerHTML = calendar.map(formatEvent).join('')
    } catch (error) {
      console.error(error)
      return error
    } finally {
      window.setTimeout(updateCalendar, midnight())
    }
  }

  // Iterate over all .placeholder elements and randomize their width
  let placeholderRandomizer = () => {
    [
      { s: '.placeholder.meta', width: 4 },
      { s: '.placeholder.title', width: 10 }
    ].forEach(({ s, width }) => {
      $$(s).forEach((x) => {
        x.style.width = `${width + Math.random() * (width / 2)}rem`
      })
    })
  }


  let updateShoutbox = async () => {
    try {
      let shoutbox = await (await fetch('shoutbox/')).json()
      let container = $('#shoutbox > div')
      container.innerHTML = shoutbox.map((x) => {
        return `<p class="shout">${x}</p>`
      }).reverse().join('')
    } catch (error) {
      console.error(error)
      return error
    } finally {
      window.setTimeout(updateShoutbox, 20000)
    }
  }

  function ProgressBar(maxProgress, tag = '#progress-bar') {
    this.maxProgress = maxProgress;
    this.progress = 0;
    this.addEventListener('progress', (function ({ detail: { progress }}) {
      this.progress += progress;
      $(tag).style.setProperty('--n', `${this.progress / (this.maxProgress) * 100}%`);
    }));
    return this;
  }

  const progressWrapper = async (progressBar, promise, progress) => {
    const result = await promise;
    if (result instanceof Error) {
      // Show the error
      $('#error').innerText = result.message;
      // Hide the progress bar
      $('#progress-bar').style.display = 'none';
      // Throw the error to stop the execution
      throw result;
    }
    progressBar.dispatchEvent(new CustomEvent('progress', { detail: { progress } }));
    return result;
  };
  

  const progressBar = ProgressBar.call(new EventTarget(), 4);
  
  timeAndDate()
  window.setInterval(timeAndDate, 1000)
  placeholderRandomizer()
  updateCalendar()
  await Promise.all([
    [new Promise(resolve => setTimeout(resolve, 500)), 1],
    [loadSponsorLogos().then(() => Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; })))).catch(e => e ), 1],
    [updateMenus(), 1],
    [updateShoutbox(), 1],
  ].map(([p, pp]) => progressWrapper(progressBar, p, pp)));
  
  // Add class to body when everything is loaded
  document.body.classList.add('loaded')
})
