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

        } else if (animationStarted > 0) {
          // Animation takes 2 * delay + pixels / speed milliseconds 
          let speed = 0.05
          let delay = 2000
          let animationDuration = 2 * (delay + maxScroll / speed)
          let timeElapsed = (ms - animationStarted) % animationDuration
          // One-liner to scroll element down, wait for 1000ms before changing direction, then scroll up
          let scrollPosition =
            timeElapsed < delay ? 0 :
            timeElapsed < delay + maxScroll / speed ? (timeElapsed - delay) * speed :
            timeElapsed < 2 * delay + maxScroll / speed ? maxScroll :
            maxScroll - (timeElapsed - 2 * delay - maxScroll / speed) * speed
          el.dataset.scrollPosition = scrollPosition
          el.scrollTop = scrollPosition
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
  
        container.querySelector('.menu').innerHTML = Object.entries(categories).map((x) => {
          let html = ''
          if (x[0] !== '') html += `<h3>${x[0]}</h3>`
          x[1].forEach((y) => {
            let isLight = x[0] !== ''
            // Remove allergens from properties for better readability
            let properties = y.properties.filter((x) => !x.match(/\+/))
            html += `<p class="${isLight ? 'light' : ''}">${x[0] ? y.title.slice(x[0].length + 2) : y.title}`
            if (properties.length > 0) html += `\n<span class="properties">${properties.join(' ')}</span>`
            html += `</p>`
          })
          return html
        }).join('')
      })
    } catch (error) {
      console.error(error)
    } finally {
      // Update menus every 4 hours and at midnight
      window.setTimeout(updateMenus, Math.min(midnight(), 4 * 60 * 60 * 1000))
    }
  }

  let updateCalendar = async () => {
    try {
      let calendar = await (await fetch('calendar/')).json()
      let container = $('#events > div')
      container.innerHTML = calendar.map((x) => {
        let d = new Date(x.startdt)
        let date = d.toLocaleDateString('fi-FI', { month: 'numeric', weekday: 'short', day: 'numeric' })
        let time = d.getUTCHours() === 0 && d.getUTCMinutes() === 0 ? '' :
          `klo ${d.toLocaleTimeString('fi-FI', { hour: 'numeric', minute: '2-digit' })}`
        let dateTime = `${date} ${time}`
        let location = x.location ? `@ ${x.location}` : ''
        let description = x.description ? `<div class="description">${x.description}</div>` : ''
        return `<div class="event">
          <div class="meta">${dateTime} ${location}</div>
          <div class="title">${x.summary}</div>
          ${description}
        </div>`
      }).join('')
    } catch (error) {
      console.error(error)
    } finally {
      window.setTimeout(updateCalendar, midnight())
    }
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
    } finally {
    window.setTimeout(updateShoutbox, 20000)
    }
  }


  timeAndDate()
  window.setInterval(timeAndDate, 1000)

  loadSponsorLogos()
  updateMenus()
  updateCalendar()
  updateShoutbox()
})
