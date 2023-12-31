import { createApp } from 'vue'
import router from '@/../assets/router.js';
import { userStore, loopStore } from '@/../assets/userStore.js';
import readyIcon from '@/../src/ui/ready.vue';
import App from '@/App.vue'
import { createStore } from 'vuex';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faChevronLeft, faMobileScreenButton } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faChevronLeft, faMobileScreenButton)


const store = createStore({
  modules: {
    userStore,
    loopStore
  }
});




const app = createApp(App);
app.use(router);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('readyIcon', readyIcon)
router.isReady().then(() => app.mount('#app'))
