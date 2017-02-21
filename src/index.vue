<template></template>
<script>
  export default  {
    name: 'Calendar',
    props: {
      type: {
        type: String,
        default: date
      },
      value: '',
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {

      }
    },
    methods: {
      render() {

      },
      getDays(year, month) {
        return new Date(year, month+1, 0).getDate()
      }
    }
  };
  
</script>