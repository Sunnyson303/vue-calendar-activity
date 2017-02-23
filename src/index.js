import Calendar from './component.vue'

Calendar.install = function(Vue) {
    Vue.component(Calendar.name, Calendar)
}
if(window.Vue) {
  Vue.use(Calendar)
}
export default Calendar
