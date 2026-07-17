import './style.css';
import { mountHome } from './pages/home';
import { mountBlackbox } from './pages/blackbox';
import { mountCabin } from './pages/cabin';
import { mountTerminal } from './pages/terminal';
import { mountAbout } from './pages/about';
import { mountWorks } from './pages/works';
import { mountLab } from './pages/lab';
import { mountContact } from './pages/contact';
import { mountNotFound } from './pages/notfound';

const app = document.querySelector('#app');
const page = document.body.dataset.page;

const pageMap = {
  home: mountHome,
  blackbox: mountBlackbox,
  about: mountAbout,
  works: mountWorks,
  lab: mountLab,
  contact: mountContact,
  '404': mountNotFound,
  cabin: mountCabin,
  terminal: mountTerminal,
};

if (pageMap[page]) {
  pageMap[page](app);
} else {
  app.innerHTML = `<div class="page"><h1>Unknown Page</h1></div>`;
}