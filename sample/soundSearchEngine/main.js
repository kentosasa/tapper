var data = {
  currentEntry: -1,
  entries: [
  ],
  searching: false
}

var model = {
  init: function() {
  },

  next: function() {
    if (!data.searching) {
      data.currentEntry = data.currentEntry < data.entries.length-1 ?  data.currentEntry + 1 : 0
    }
  },

  setEntries: function (value) {
    data.currentEntry = 0
    data.entries = value
  },

  entries: function () {
    return data.entries
  },

  search: function () {
    data.searching = true
  },

  searchFinish: function () {
    data.searching = false
  },

  currentEntry: function () {
    return data.currentEntry
  },

  searching: function () {
    return data.searching
  }
}

var controller = {
  init: function() {
      model.init()
      knock.init()
      speechSearch.init()
      view.init()
  },

  next: function() {
    model.next()
    view.render()
  },

  search: function() {
    model.search()
    speechSearch.speechStart()
    view.render()
  },

  setEntries: function (value) {
    model.searchFinish()
    model.setEntries(value)
    view.render()
  },

  getEntries: function () {
    return model.entries()
  },

  getCurrentEntry: function () {
    return model.currentEntry()
  },

  isSearching: function () {
    return model.searching()
  }
}

var view = {
    init: function() {
      view.render()
    },

    render: function(){
      var main = document.getElementById('main')
      var intro = document.getElementById('intro')
      var searchBox = document.getElementById('searchBox')
      var currentEntry = controller.getCurrentEntry()

      if (currentEntry == -1) {
        console.log('status: intro')
      } else if (controller.isSearching()) {
        console.log('status: searching')
      } else {
        console.log('status: show')
      }
    }
}

var knock = {
  init: function () {
    var tapper = require('../../')
    var callback = function (res) {
      switch (res.type) {
        case 'knock':
          controller.next()
          break
        case 'snap':
          controller.search()
          break
      }
    }
    var opt = {
      types: ['knock', 'snap']
    }
    this.microphone = new tapper.microphone(callback, opt)
  }
}

var speechSearch = {
  init: function () {
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
    this.recognition = new webkitSpeechRecognition()
    this.recognition.lang = 'ja'
    this.recognition.addEventListener('result', this.speechCallback, false);
  },

  speechStart() {
    this.recognition.start()
  },

  speechCallback: function (event) {
    speechSearch.callSearchAPI(event.results.item(0).item(0).transcript)
  },

  callSearchAPI: function (keyword) {
    var xhr = new XMLHttpRequest()
    var url = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q=" + keyword + "&count=100"
    xhr.open("GET" , url)
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", '17a287dd62774bf898220958755a6cb5')
    xhr.send()
    xhr.onload = speechSearch.callbackSearchAPI
  },

  callbackSearchAPI: function (event) {
    controller.setEntries(event.target.response.value)
  }
}

controller.init();
