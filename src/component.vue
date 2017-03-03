<template>
  <div class="calendar-wrapper">
    <div class="calendar-header">
      <div class="calendar-btn calendar-btn-today" @click="focusToday()">今天</div>
      <div>
        <i class="calendar-prev" @click="prevMonth()"> &lt; </i>
        <div id="date-select-btn" data-options='{"type":"month"}'>
          <span class="calendar-curr-year">{{this.year}}</span> 年
          <span class="calendar-curr-month">{{this.month + 1}}</span> 月
        </div>
        <i class="calendar-next" @click="nextMonth()"> &gt; </i>
      </div>
      <div>
        <!--<i class="icon icon-plus" @click="addActivity()"> + </i>-->
      </div>
    </div>
    <div class="calendar-body">
      <div class="calendar-weeks">
        <div class="calendar-week" v-for="item in weeks">{{item}}</div>
      </div>
      <div class="calendar-days" :class="{'week-mode': weekShowFlag}">
        <div class="calendar-days-line" :class="{in: weekShowFlag==l}" v-for="(line, l) in days">
          <div class="calendar-day" 
            :class="{'calendar-day-dis': item.disabled, 'calendar-day-today': item.today,'calendar-day-selected': item.selected, 'calendar-day-plan-delivery': item.plan, 'calendar-day-stop-delivery': item.stop, 'calendar-day-farmer-delivery': item.farmer}"
            v-for="(item, i) in line" @click="handleDayClick(l, i)">
            {{item.day | zero}}
            <i class="mui-icon mui-icon-location calendar-location-arrow"></i>
            <div class="calendar-today-tips-wrap">
              <span class="calendar-today-tips" >今天</span>
              <i class="fa fa-star calendar-star"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="calendar-footer">
      <div class="calendar-time"></div>
      <div class="calendar-btns">
      </div>
    </div>
    <slot name="bottom-content">
    </slot>
    <!--<activity 
      v-model="activityModal.show" 
      :title="activityModal.title" 
      :content="activityTitle" 
      :start-date="activityModal.startDate"
      :end-date="activityModal.endDate"
      :finish="activityAdded"
      >
    </activity>-->
  </div>
</template>
<script>
  import dateFormat from 'dateformat'
  import moment from 'moment'
  // import activity from './activity.vue'
  export default {
    name: 'CalendarActivity',
    components: {
      // activity
    },
    props: {
      type: {
        type: String,
        default: 'date'
      },
      handleDaySelect: Function,
      dateSelected: Object, //外部传入的当前选择的日期
      value: '',
      show: {
        type: Boolean,
      },
      weeks: {
        type: Array,
        default () {
          return ['日', '一', '二', '三', '四', '五', '六']
        }
      },
      activityList: [],
      planDelivery: {
        type: Array,
        default () {
          return []
        }
      },
      stopDelivery: {
        type: Array,
        default () {
          return []
        }
      },
      farmerDelivery: {
        type: Array,
        default () {
          return []
        }
      },
      dateParseFormat: {
        type: String,
        default: 'YYYY-MM-DD'
      }
    },
    data() {
      let now = new Date()
      return {
        year: now.getFullYear(),
        month: now.getMonth(),
        day: now.getDate(),
        days: [],
        today: new Date(),
        weekShowFlag: null //上下滑动时显示哪一列的标志位
        /*activityModal: {
          show: true,
          startDate: dateFormat(now, 'isoDate'),
          startTime: dateFormat(now, 'HH:mm'),
          endDate: dateFormat(now, 'isoDate'),
          endTime: dateFormat(now, 'HH:mm'),
        },
        activityTitle: ''*/
      }
    },
    filters: {
      zero(val) {
        return val < 10 ? '0' + val : val
      }
    },
    mounted() {
      this.init()
    },
    watch: {
      dateSelected(val) {
        if (val.y && val.M) {
          this.render(val.y, val.M - 1)
          this.triggerPropsDaySelect()
        }
      }
    },
    methods: {
      init() {
        if (!this.value) {
          let today = new Date()
          this.year = today.getFullYear()
          this.month = today.getMonth()
          this.render(this.year, this.month)
        }
        this.handleSlidingAround()
        this.handleSlideUpDown()
      },
      render(y, m) {
        let currMonthFirstDay = new Date(y, m, 1).getDay(), //本月第一天是周几
          currMonthDays = new Date(y, m + 1, 0).getDate(), //本月总天数
          lastMonthDays = new Date(y, m, 0).getDate(), //上个月总天数
          line = 0,
          temp = [],
          today = this.today
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

          // 今天
          let _temp_day = {
              day: i
            },
            _temp_day_format = moment({
              year: y,
              month: m,
              day: i
            }).format(this.dateParseFormat)



          //由父组件手动传递选择日期,只有在父组件没有值的情况下 才默认选择今天
          if (this.dateSelected.str) {
            if (this.dateSelected.d == i || (!this.dateSelected.d && this.day == i)) {
              _temp_day.selected = true
            }
          } else {
            if (this.day == i) {
              _temp_day.selected = true
              if (this.year === today.getFullYear() && this.month === today.getMonth()) {
                _temp_day.today = true
              }
            }
          }


          if (this.planDelivery.indexOf(_temp_day_format) > -1) {
            _temp_day.plan = true
          }
          if (this.stopDelivery.indexOf(_temp_day_format) > -1) {
            _temp_day.stop = true
          }
          if (this.farmerDelivery.indexOf(_temp_day_format) > -1) {
            _temp_day.farmer = true
          }

          temp[line].push(_temp_day)

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
        this.year = new Date(y, m).getFullYear()
        this.month = new Date(y, m).getMonth()
      },
      handleSlidingAround() {
        var $target = document.querySelector('.calendar-body')
        var start, end, deltax, deltay, self = this
        $target.addEventListener('touchstart', function(e) {
          start = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
          }
        })
        $target.addEventListener('touchmove', function(e) {
          end = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
          }
          deltax = end.x - start.x
          deltay = end.y - start.y
        })
        $target.addEventListener('touchend', function(e) {
          if (deltax > 100 && (deltay >= 50 || deltay <= 50)) {
            self.nextMonth()
          } else if (deltax < -100 && (deltay >= 50 || deltay <= 50)) {
            self.prevMonth()
          }
        })
      },
      handleSlideUpDown() {
        var $target = document.querySelector('.calendar-bottom-content')
        var start, end, deltax, deltay, self = this
        $target.addEventListener('touchstart', function(e) {
          start = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
          }
        })
        $target.addEventListener('touchmove', function(e) {
          end = {
            x: e.touches[0].pageX,
            y: e.touches[0].pageY
          }
          deltax = end.x - start.x
          deltay = end.y - start.y
        })
        $target.addEventListener('touchend', function(e) {
          if (deltay > 100 && (deltax >= 50 || deltax <= 50)) {
            self.changeToMonth()
          } else if (deltay < -100 && (deltax >= 50 || deltax <= 50)) {
            self.changeToWeek()
          }
        })
      },
      // 伸展为月日历
      changeToMonth() {
        this.weekShowFlag = null
      },
      // 缩进为周日历
      changeToWeek() {
        this.days.forEach((line, l) => {
          line.forEach(day => {
            if (day.selected == true) {
              this.weekShowFlag = l
              return false
            }
          })
        })
      },
      prevMonth() {
        this.render(this.year, --this.month)
        this.triggerPropsDaySelect()
      },
      nextMonth() {
        this.render(this.year, ++this.month)
        this.triggerPropsDaySelect()
      },
      focusToday() {
        this.days.forEach((line) => {
          line.forEach((day) => {
            day.selected = false
          })
        })
        this.day = this.today.getDate()
        this.render(this.today.getFullYear(), this.today.getMonth())
      },
      handleDayClick(l, i) {
        this.days.forEach((line) => {
          line.forEach((day) => {
            day.selected = false
          })
        })

        let item = this.days[l][i]
        let day = item.day
        if (!item.disabled) {
          if (item.selected) {} else {
            item.selected = true
            this.day = day
          }
        }
        this.triggerPropsDaySelect()
      },
      //改变年月日都要重新请求当天配送计划
      triggerPropsDaySelect() {
        this.handleDaySelect(moment({
          y: this.year,
          M: this.month,
          d: this.day
        }).format(this.dateParseFormat))
      },
      addActivity() {
        this.activityModal.show = true
      },
      activityAdded({
        title,
        content,
        start,
        end
      }) {
        this.activityList.push({
          title,
          content
        })
      }
    }
  };
</script>

<style lang="less">
  @base: #9dd456;
  @color: #77AF9C;
  @white: #fff;
  @red: #ff5555;
  @deepred: #E71D36;
  .border-1-red {
    border: 1px solid @red;
  }
  
  .block {
    display: block;
  }
  
  .none {
    display: none;
  }
  
  .inline-block {
    display: inline-block;
  }
  
  .font-12 {
    font-size: 12px;
  }
  
  .font-10 {
    font-size: 10px;
  }
  
  .font-9 {
    font-size: 9px;
  }
  
  .absolute {
    position: absolute;
  }
  
  .relative {
    position: relative;
  }
  
  .text-right {
    text-align: right;
  }
  
  .calendar-wrapper {
    background: #f8f8f8;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, .1);
    border: 1px solid #ccc;
    .calendar-header {
      display: flex;
      justify-content: center;
      padding: 10px 0;
      color: #fff;
      background: @base;
      #date-select-btn {
        .inline-block;
      }
      .calendar-btn {
        .absolute;
        left: 15px;
        font-size: 12px;
      }
      .calendar-prev {
        margin-right: 10px;
      }
      .calendar-next {
        margin-left: 10px;
      }
      .icon.icon-plus {
        position: absolute;
        right: 20px;
        font-weight: bold;
        font-size: 26px;
        top: 13px;
      }
    }
    .calendar-body {
      .calendar-weeks {
        display: flex;
        justify-content: space-around;
        color: @base;
        padding: 5px;
        .calendar-week {
          flex: 1;
          background: #fff;
          margin-right: 5px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .calendar-days {
        .calendar-days-line {
          display: flex;
          justify-content: space-around;
          padding: 5px 5px 0 5px;
          .calendar-day {
            padding: 0 6px 6px 6px;
            height: 34px;
            flex: 1;
            box-shadow: 0 0 2px rgba(0, 0, 0, .3);
            border: 1px solid transparent;
            margin-right: 5px;
            background: #fff;
            font-size: 12px;
            .relative;
            &:last-child {
              margin-right: 0;
            }
            &.calendar-day-dis {
              color: #999;
              background: #eee;
            }
            &.calendar-day-today {
              .calendar-today-tips-wrap .calendar-today-tips {
                .inline-block;
              }
            }
            &.calendar-day-selected {
              .border-1-red;
            }
            &.calendar-day-plan-delivery {
              color: @red;
              .calendar-location-arrow {
                .block;
                .absolute;
                top: 4px;
                right: 6px;
                font-size: 14px;
                font-weight: bold;
              }
            }
            &.calendar-day-stop-delivery {
              background: #ccc;
            }
            &.calendar-day-farmer-delivery {
              .calendar-star {
                .inline-block;
                color: @base;
              }
            }
            .calendar-star,
            .calendar-location-arrow {
              .none;
            }
            .calendar-today-tips-wrap {
              margin-top: -3px;
              line-height: 12px;
              .text-right;
              .calendar-today-tips {
                .none;
                .font-9;
                line-height: normal;
                color: @red;
              }
            }
          }
        }
        &.week-mode {
          .calendar-days-line {
            .none;
            &.in {
              display: flex;
            }
          }
        }
      }
    }
    .calendar-footer {
      .calendar-btns {
        display: flex;
        justify-content: space-around;
        .calendar-btn {
          border: 1px solid #ddd;
          font-size: 14px;
          padding: 6px 8px;
          color: @color;
          border-radis: 2px;
          &.calendar-btn-today {
            text-align: center;
          }
        }
      }
    }
    i {
      font-style: normal;
    }
  }
</style>