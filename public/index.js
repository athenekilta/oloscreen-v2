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

  let sponsorLogos = async () => {
    // Fetch logos from API
    let links = await (await fetch('logo-links')).json()
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
    let restaurants = await (await fetch('restaurants')).json()
    Object.entries(restaurants).forEach(([name, o]) => {
      let container = $(`#${name}`)
      let d = new Date()
      container.querySelector('.opening-hours').innerText = o.openingHours[(d.getDay() + 6) % 7]
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
          if (properties) html += `\n<span class="properties">${properties.join(' ')}</span>`
          html += `</p>`
        })
        return html
      }).join('')
    })
    // Update menus every 4 hours and at midnight
    window.setTimeout(updateMenus, Math.min(midnight(), 14400000))
  }

  let updateCalendar = async () => {
    let calendar = await (await fetch('calendar')).json()
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
    window.setTimeout(updateCalendar, midnight())
  }

  let updateShoutbox = async () => {
    let shoutbox = await (await fetch('shoutbox')).json()
    let container = $('#shoutbox > div')
    container.innerHTML = shoutbox.map((x) => {
      return `<p class="shout">${x}</p>`
    }).join('')
  }

  let toggleSlides = async () => {
    let slides = $$('main > section')
    let progress = $('#progress')
    progress.classList.remove('animated')
    slides.forEach((x, i) => {
      if (i !== active) x.classList.remove('active')
      else {
        window.setTimeout(() => {
          x.classList.add('active')
        }, 500)
        if (x.id === 'others') {
          updateShoutbox()
        }
      }
      window.setTimeout(() => {
        progress.classList.add('animated')
      }, 1000)
    })
    active = (active + 1) % slides.length
    window.setTimeout(toggleSlides, 6000)
  }


  // Update time and date every second
  timeAndDate()
  window.setInterval(timeAndDate, 1000)
  sponsorLogos()
  updateMenus()
  updateCalendar()
  updateShoutbox()
  let active = 0;
  toggleSlides()

})
