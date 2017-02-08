var data = {
  currentEntry: -1,
  entries: [
  ],
  status: 'intro'
}

var model = {
  init: function() {
  },

  next: function() {
    data.currentEntry = data.currentEntry < data.entries.length-1 ?  data.currentEntry + 1 : 0
  },

  setEntries: function (value) {
    data.currentEntry = 10
    data.entries = value
  },

  entries: function () {
    return data.entries
  },

  currentEntry: function () {
    return data.currentEntry
  },

  status: function () {
    return data.status
  },

  setStatus: function (status) {
    data.status = status
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
    model.setStatus('move')
    model.next()
    view.render()
  },

  search: function() {
    model.setStatus('searching')
    speechSearch.speechStart()
    view.render()
  },

  showEntries: function() {
    model.setStatus('list')
  },

  setEntries: function (value) {
    model.setEntries(value)
    view.render()
  },

  getEntries: function () {
    return model.entries()
  },

  getCurrentEntry: function () {
    return model.currentEntry()
  },

  getStatus: function () {
    return model.status()
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
      var entries = controller.getEntries()
      console.log(controller.getStatus())
      switch (controller.getStatus()) {
        case 'intro':
          intro.style.display = "block"
          searchBox.style.display = "none"
          break
        case 'searching':
          searchBox.style.display = "flex"
          break
        case 'list':
          intro.style.display = "none"
          searchBox.style.display = "none"
          var contents = ''
          for (var i = 0; i < entries.length; i++) {
            var className = 'none'
            if ( i == currentEntry) {
              className = 'big'
            } else if ( currentEntry-2 <= i && i <= currentEntry+2) {
              className = 'small'
            }
            contents += '<div id="item'
               + i
               + '" class="item '
               + className
               + '">'
               + '<p class="title">'
               + entries[i].name
               + '</p>'
               + '<a href="'
               + entries[i].url
               + '">'
               + entries[i].displayUrl
               + '</a>'
               + '<p class="snippet">'
               + entries[i].snippet
               + '</p>'
               + '</div>'
          }
          main.innerHTML = contents
          break
        case 'move':
          intro.style.display = "none"
          searchBox.style.display = "none"
          var contents = ''
          for (var i = 0; i < entries.length; i++) {
            var className = 'none'
            if ( i == currentEntry) {
              className = 'big'
            } else if ( currentEntry-2 <= i && i <= currentEntry+2) {
              className = 'small'
            }
            document.getElementById('item' + i).className = 'item ' + className
          }
          break
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
    this.recognition.onresult = controller.showEntries
  },

  speechStart() {
    this.recognition.start()
  },

  speechCallback: function (event) {
    controller.showEntries()
    speechSearch.callSearchAPI(event.results.item(0).item(0).transcript)
  },

  callSearchAPI: function (keyword) {
    var xhr = new XMLHttpRequest()
    var url = "https://api.cognitive.microsoft.com/bing/v5.0/search?q=" + keyword + "&count=100"
    xhr.open("GET" , url)
    xhr.responseType = 'json';
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Ocp-Apim-Subscription-Key", '17a287dd62774bf898220958755a6cb5')
    xhr.send()
    xhr.onload = speechSearch.callbackSearchAPI
  },

  callbackSearchAPI: function (event) {
    controller.setEntries(event.target.response.webPages.value)
  }
}

controller.init();
