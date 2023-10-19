import { reactive } from "vue";
import { io } from "socket.io-client";
import { userStore } from '@/../assets/userStore.js';


export const state = reactive({
  connected: false,
  loading: false,
  socketId: '',
  userName: null,
  goUrl: null,
  gameRooms: null,
  lobbyPlayerList: null,
  currentPlayers: null,
  router: null,
  loginError: null,
  activeGameRoom: null,
  gameDataFirstLoad: null,
  gameDataUpdate: null,
  currentCard: null,
  drawVote: null,
  gameOne: {
    readyList: null,
    gameOver: null,
    readyToGo: false
  },
  blackJack: null
});

const testURL = 'http://200.69.21.59:88'
const testURL2 = 'http://127.0.0.1:5000/'

// "undefined" means the URL will be computed from the `window.location` object
const URL = testURL;

export const socket = io(URL);

socket.on("connect", (el) => {
  console.log('connect')
  state.connected = null
  state.connected = true;
  state.socketId = socket.id;
});

socket.on("disconnect", () => {
  state.connected = false;
});


socket.on('re_act', function (data) {

  state.goUrl = null;
  state.gameDataFirstLoad = null;
  console.log(data.way);
  switch (data.way) {

    case 'id_check':
      if (data.game_list != null || data.game_list != undefined) {
        state.gameRooms = null;
        state.gameRooms = data.game_list;
      }


      // lobby escapes from load cycles.
      if (data.url === 'lobby') {
        state.gameOne.gameOver = data;
      }

      if (data.go === 'waiting_room')
        state.goUrl = `waiting_room/${data.url}`

      break;

    case 'login':
      localStorage.setItem('userData', JSON.stringify({ userName: data.id }));
      state.loginError = null;

      if (data.url != null || data.url != undefined) {
        state.goUrl = data.url;
      }

      if (data.message != null || data.message != undefined)
        state.loginError = data.message;
      break;

    case 'lunch_bj':
    case 'lunch_mind':

      if (data.url === null || data.url === undefined) break;

      const gameRoom = data.url.substring(data.url.indexOf('/') + 1)
      state.activeGameRoom = gameRoom
      const userData = JSON.parse(localStorage.getItem('userData'));
      userData.userRoom = gameRoom

      state.goUrl = data.url;

      localStorage.setItem('userData', JSON.stringify(userData));

      state.gameDataFirstLoad = data

      break;
  }


});


socket.on('updata_lobby', function (data) {
  state.currentPlayers = data.room_data

})


socket.on('update_lobby', function (data) {
  if (data.user_sids != null || data.user_sids != undefined)
    state.lobbyPlayerList = data.user_sids;

  if (data.page != null || data.page != undefined)
    state.currentPlayers = data.page;
})

socket.on('updata_ready', function (data) {
  state.gameOne.readyToGo = false;
  state.gameOne.readyList = data.reduce((key, val, index) => {
    key[val] = val
    return key
  }, {})
})

socket.on('update_game', function (data) {
  state.gameDataUpdate = data
  state.drawVote = null
})

socket.on('re_flash', function (data) {
  state.gameDataUpdate = data
})

socket.on('re_draw', function (data) {
  state.drawVote = null;
  if (data.message === 'draw') state.drawVote = { isPass: true }
  if (data.message === 'play') state.drawVote = { isPass: false, card: data.card };


})

socket.on('re_lunch', function (data) {
  state.gameOne.readyToGo = false;
  if (data.isReady != null || data.isReady != undefined) {
    state.gameOne.readyToGo = data.isReady;
  }
})


socket.on('re_bj', function (data) {
  console.log(data);
  if (data === null || data === undefined) return;
  state.blackJack = null;

  state.blackJack = data
})

socket.on('re_no_game', function (data) {
  console.log('re_no_game', data);
  state.goUrl = null;
  if (data.noRoom === null || data.noRoom === undefined) return;
  state.goUrl = 'lobby';
})

