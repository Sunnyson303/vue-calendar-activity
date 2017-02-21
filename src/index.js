import Calendar from './index.js'
Calendar.install = function(Vue) {
  if(Vue) {
    Vue.use(Calendar.name, Calendar)
  }
}