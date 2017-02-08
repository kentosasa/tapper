var data = {
  currentHeight: 0
}

var model = {
  init: function() {
  },
  getCurrentHeight: function() {
    return  data.currentHeight
  },
  scrollUp: function() {
    data.currentHeight += 100
  },
  scrollDown: function() {
    data.currentHeight -= 100
  }
}

var controller = {
  scrollUp: function() {
    model.scrollUp()
    view.render()
  },
  scrollDown: function() {
    model.scrollDown()
    view.render()
  },
  currentHeight: function() {
    return model.getCurrentHeight()
  },
  init: function() {
      model.init()
      tapper.init()
      view.init()
  }
}

var view = {
    init: function() {
      view.render()
    },
    render: function(){
      console.log('render')
      var height = controller.currentHeight()
      var contents = ''
      for (var i = 0; i < height/100 + 20; i++) {
        contents += '<div class="item">' + i + '</div>'
      }
      document.getElementById('contents').innerHTML = contents
      window.scrollTo(0,height)
    }
}

var tapper = {
  init: function () {
    var callback = function (res) {
      console.log(res)
      switch (res.type) {
        case 'knock':
          controller.scrollUp()
          break
        case 'knuckle':
          controller.scrollDown()
          break
      }
    }
    var tapper = require('../../')
    var opt = {
      types: ['knock', 'knuckle']
    }
    this.microphone = new tapper.microphone(callback, opt)
  }
}

controller.init();
