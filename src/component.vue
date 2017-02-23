<template>
  <div class="calendar-wrapper">
    <div class="calendar-header">
      <i class="calendar-prev"> &lt; </i>
      <span class="calendar-curr-year">{{this.year}}</span> /
      <span class="calendar-curr-month">{{this.month}}</span>
      <i class="calendar-next"> &gt; </i>
    </div>
    <div class="calendar-body">
      <div class="calendar-weeks">
        <div class="calendar-week" v-for="item in weeks">{{item}}</div>
      </div>
      <div class="calendar-days">
        <div class="calendar-days-line" v-for="line in days">
          <div class="calendar-day" 
            :class="{'calendar-day-dis': item.disabled, 'calendar-day-today': item.today}" 
            v-for="item in line" 
            @click="select(new Date(year, month, item.day))">
            {{item.day | zero}}
          </div>
        </div>
      </div>
    </div>
    <div class="calendar-footer">
      <div class="calendar-time"></div>
      <div class="calendar-btns">
        <div class="calendar-btn calendar-btn-today">今天</div>
        <div class="calendar-btn calendar-btn-cancle">取消</div>
      </div>
    </div>
    <div class="calendar-activity" slot="activity"></div>
  </div>
</template>
<script>
  export default {
    name: 'CalendarActivity',
    props: {
      type: {
        type: String,
        default: 'date'
      },
      selected: Function,
      value: '',
      show: {
        type: Boolean,
        default: false
      },
      weeks: {
        type: Array,
        default () {
          return ['日', '一', '二', '三', '四', '五', '六']
        }
      }
    },
    data() {
      return {
        year: '',
        month: '',
        day: '',
        days: []
      }
    },
    filters: {
      zero(val) {
        return val < 10 ? '0' + val : val
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        if (!this.value) {
          let today = new Date()
          this.year = today.getFullYear()
          this.month = today.getMonth() + 1
          this.render(this.year, this.month)
        }
      },
      render(y, m) {
        let currMonthFirstDay = new Date(y, m, 1).getDay(), //本月第一天是周几
          currMonthDays = new Date(y, m + 1, 0).getDate(), //本月总天数
          lastMonthDays = new Date(y, m, 0).getDate(), //上个月总天数
          line = 0,
          temp = [],
          today = new Date()
        // 渲染当前月日期
        for (let i = 1; i <= currMonthDays; i++) {
          let i_day = new Date(y, m, i).getDay()
          if (i_day === 0) {
            temp[line] = []
          } else if (i === 1) {
            temp[line] = []

            //渲染上个月在当前月的日期
            let lastMonthStart = lastMonthDays - currMonthFirstDay + 1
            for (let j = 0; j < currMonthFirstDay; j++) {
              temp[line].push({
                day: lastMonthStart,
                disabled: true
              })
              lastMonthStart++
            }
          }
          if(today.getDate() === i) {
            temp[line].push({
              day: i,
              selected: true,
              today: true
            })
          }
            temp[line].push({
              day: i,
              selected: false
            })
          if (i_day === 6) {
            line++
          }
          if (i === currMonthDays) {
            //渲染下个月在当前月的日期
            for (let k = 1; k <= 6 - i_day; k++) {
              temp[line].push({
                day: k,
                disabled: true
              })
            }
          }
        }
        this.days = temp
      }
    }
  };
</script>

<style lang="less">
  @base: #9dd456;
  @color: #77AF9C;
  @white: #fff;
  .calendar-wrapper {
    background: #fff;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, .1);
    border: 1px solid #ccc;
    .calendar-header {
      display: flex;
      justify-content: center;
      padding: 10px 0;
      color: #fff;
      background: @base;
      .calendar-prev {
        margin-right: 10px;
      }
      .calendar-next {
        margin-left: 10px;
      }
    }
    .calendar-body {
      .calendar-weeks {
        display: flex;
        justify-content: space-around;
        color: @base;
      }
      .calendar-days {
        .calendar-days-line {
          display: flex;
          justify-content: space-around;
          .calendar-day {
            padding: 6px;
            &.calendar-day-dis {
              color: #999;
            }
            &.calendar-day-today {
              background: @color;
              color: @white;
            }
          }
        }
      }
    }
    .calendar-footer {
      margin: 20px 0;
      .calendar-btns {
        display: flex;
        justify-content: space-around;
        .calendar-btn {
          border: 1px solid #ddd;
          padding: 10px 15px;
          color: @color;
          border-radis: 2px;
          &.calendar-btn-today {
            text-align: center;
          }
        }
      }
    }
  }
</style>