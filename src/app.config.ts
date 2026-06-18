export default defineAppConfig({
  pages: [
    'pages/schedule/index',
    'pages/waitlist/index',
    'pages/approval/index',
    'pages/registration/index',
    'pages/stage-detail/index',
    'pages/approval-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#2D3436',
    navigationBarTitleText: '剧场舞台租用',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f5f6f7'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#2D3436',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/schedule/index',
        text: '舞台排期'
      },
      {
        pagePath: 'pages/waitlist/index',
        text: '候补补位'
      },
      {
        pagePath: 'pages/approval/index',
        text: '审批中心'
      },
      {
        pagePath: 'pages/registration/index',
        text: '报批登记'
      }
    ]
  }
})
