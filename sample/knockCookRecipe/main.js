var tapper = require('../../')
var microphone
var opt = {
  types: ['knock']
}

var data = {
  currentPage: 0,
  recipe: [
    {
      title: 'カレーライスの作り方',
      text: '材料 （２人分）\n肉(牛豚鳥どれでも可、なくても可)50~100g\n人参1/2本\n玉ねぎ1/4個\nじゃがいも小１個\nカレー粉 大さじ２\n小麦粉大さじ２\n白だし 大さじ２\nこしょう適量\n中濃ソース大さじ１\n水①100ml\n水②150ml',
      image: 'https://img.cpcdn.com/recipes/4304962/280/d03c4132a2f833577619b035932a79d6.jpg?u=3548535&p=1485081892'
    },
    {
      title: '手順1',
      text: '玉ねぎ人参は薄く切り、じゃがいもも一口サイズに切る。\n※他の野菜も、一口サイズ又は薄切り。',
      image: 'https://img.cpcdn.com/steps/21483573/136/b370063e430a4c974501c3be84376519.jpg?u=3548535&p=1485081815'
    },
    {
      title: '手順2',
      text: '肉も一口サイズか、薄くスライスしておく。',
      image: 'https://img.cpcdn.com/steps/21483574/136/fcf7556527aeef5150dc789acd2ed59f.jpg?u=3548535&p=1485081825'
    },
    {
      title: '手順3',
      text: '加熱前のノンスティックパンに、肉と野菜を全て入れる。\n※写真は、じゃがいもなし、蓮根としめじ入りです。',
      image: 'https://img.cpcdn.com/steps/21483575/136/264332ef2d2cba29676943eb302bb23a.jpg?u=3548535&p=1485081834'
    },
    {
      title: '手順4',
      text: 'カレー粉と小麦粉を入れ、材料全体にからまるように混ぜ、白だしとコショウ、水①を入れる',
      image: 'https://img.cpcdn.com/steps/21483576/136/622d23e85bd9b7098f46017686ab4466.jpg?u=3548535&p=1485081843'
    },
    {
      title: '手順5',
      text: 'R8でスタートし、すぐに全体を混ぜる。\n粉っぽさがなくなってくるまで、手を止めずに混ぜ続ける',
      image: 'https://img.cpcdn.com/steps/21483657/136/2f04f58d17c5afc85d981b4617481d55.jpg?u=3548535&p=1485081855'
    },
    {
      title: '手順6',
      text: '粉っぽさがなくなってきたら、水②と中濃ソースを入れ、とろみが出てくるまで煮込む。',
      image: 'https://img.cpcdn.com/steps/21483662/136/e38edfe21591542bb691960853d38193.jpg?u=3548535&p=1485081867'
    },
    {
      title: '手順7',
      text: '材料に火が通り、とろみが出てきたら完成。',
      image: 'https://img.cpcdn.com/steps/21483676/136/27a3077d5a1acc083c5d5c64f0342ee7.jpg?u=3548535&p=1485081878'
    },
  ]
}

var model = {
  init: function() {
  },
  getCurrentPage: function() {
    return  data.recipe[data.currentPage]
  },
  nextPage: function() {
    data.currentPage = data.currentPage < data.recipe.length-1 ?  data.currentPage + 1 : 0
  }
}

var controller = {
  nextPage: function() {
    model.nextPage()
    view.render()
  },

  currentPage: function() {
    return model.getCurrentPage()
  },

  init: function() {
      model.init()
      knock.init()
      view.init()
  }
}

var view = {
    init: function() {
      view.render()
    },
    render: function(){
      console.log('render')
      var item = controller.currentPage()
      document.getElementById('title').innerText = item.title
      document.getElementById('text').innerText = item.text
      document.getElementById('image').src = item.image
    }
}

var knock = {
  init: function () {
    var callback = function (res) {
      console.log(res)
      switch (res.type) {
        case 'knock':
          controller.nextPage()
          break
      }
    }
    microphone = new tapper.microphone(callback, opt)
  }
}

controller.init();
