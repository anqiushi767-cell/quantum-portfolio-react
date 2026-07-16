import './style.css';
import { mountHome } from './pages/home';
import { mountBlackbox } from './pages/blackbox';
import { mountBridge } from './pages/bridge';
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
  bridge: mountBridge,
  about: mountAbout,
  works: mountWorks,
  lab: mountLab,
  contact: mountContact,
  '404': mountNotFound
};

if (pageMap[page]) {
  pageMap[page](app);
} else {
  app.innerHTML = `<div class="page"><h1>Unknown Page</h1></div>`;
}