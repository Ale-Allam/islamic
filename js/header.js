function updateHeaderClasses() {
  const headerTop = document.querySelector('.header__top');
  const headerNav = document.querySelector('.header__nav');

  if (window.innerWidth > 768 && headerTop && headerNav) {
    if (window.scrollY >= 50) {
      headerTop.classList.add('header__top-active');
      headerNav.classList.add('header__nav-active');
    } else {
      headerTop.classList.remove('header__top-active');
      headerNav.classList.remove('header__nav-active');
    }
  } else {
    // Ensure classes are removed if conditions are not met
    headerTop?.classList.remove('header__top-active');
    headerNav?.classList.remove('header__nav-active');
  }
}

window.addEventListener('DOMContentLoaded', updateHeaderClasses);
window.addEventListener('scroll', updateHeaderClasses);
window.addEventListener('resize', updateHeaderClasses);


// Function to fetch prayer times
async function getPrayerTimes(lat, lon) {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`);
    const data = await response.json();
    return data.data.timings;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null; // Return null if an error occurs
  }
}

// Display only specific prayer times
function displayPrayerTimes(timings) {
  const container = document.getElementById('prayer-times');

  // Check if the container exists
  if (!container) {
    console.warn('Prayer times container not found.');
    return;
  }

  container.innerHTML = ''; // Clear any existing data

  // Filtered times to display
  const requiredTimes = {
    الفجر: timings.Fajr,
    الشروق: timings.Sunrise,
    الظهر: timings.Dhuhr,
    العصر: timings.Asr,
    المغرب: timings.Maghrib,
    العشاء: timings.Isha,
  };

  for (const [prayer, time] of Object.entries(requiredTimes)) {
    container.innerHTML += `
<div class="azan__item">
  <img class="azan__item-img azan__item-img--one" src="../media/svg/azan_section.svg" alt="Azan Pattern">
  <img class="azan__item-img azan__item-img--two" src="../media/svg/azan_section-2.svg" alt="Azan Pattern">
    <div class="azan__item-content">
      <h2 class="azan__item-title">${prayer}</h2>
      <p class="azan__item-time">${time}</p>
      <i class="azan__item-icon fa-solid fa-clock"></i>
    </div>
</div>
    `;
  }
}

// Check if geolocation is available
if ('geolocation' in navigator) {
  // Get user's location and fetch prayer times
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      const timings = await getPrayerTimes(latitude, longitude);

      // Display timings only if they are successfully fetched
      if (timings) {
        displayPrayerTimes(timings);
      } else {
        console.warn('Prayer timings could not be fetched.');
      }
    },
    () => {
      alert('Unable to get your location. Please enable location services.');
    }
  );
} else {
  console.warn('Geolocation is not supported by this browser.');
}
