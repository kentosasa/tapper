module.exports = {
  hoge: 'fuga',
  fftSize: 4096, //WebAudioAPIで波形を取得する際の分割数
  sampleNum: 512, // DFTするときのサンプル数
  waveCenter: 128, // JSの場合Analyzerで取得する波形の中心が128になる
  stockNum: 20, // 保持しておく過去の波形の数
  min: 5  // gainとして認める最小値
};
