<template>
  <div class="activity-wrapper" :class="{in: show}">
    <div class="activity-body">
      <div class="activity-body-header">
        <span class="activity-btn-cancel" @click="hide()">取消</span>
        <span class="activity-title">新建事件</span>
        <span class="activity-btn-add" @click="confirm()">添加</span>
      </div>
      <div class="activity-event-container">
        <div class="activity-event-title">
          <input type="text" name="" placeholder="标题" v-model="title">
        </div>
        <div class="activity-event-content">
          <input placeholder="内容" v-model="content"></input>
        </div>
      </div>
      <div class="activity-settings">
        <ul>
          <li>
            <label for="">开始</label>
            <div class="datetime">
              <span class="date">{{startDate}}</span>
              <input class="time" type="text" v-model="startTime">
            </div>
          </li>
          <li>
            <label for="">结束</label>
            <div class="datetime">
              <span class="date">{{endDate}}</span>
              <input class="time" type="text" v-model="endTime">
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="activity-mask" @click="hide()"></div>
  </div>
</template>
<script>
  import dateFormat from 'dateformat'
  export default {
    props: {
      startDate: String,
      endDate: String,
      value: {
        type: Boolean,
        default: false
      },
      finish: Function
    },
    data() {
      let now = new Date()
      let next = new Date()
      next.setHours(next.getHours() + 1)
      return {
        title: '',
        content: '',
        startTime: dateFormat(now, 'HH:mm'),
        endTime: dateFormat(now, 'HH:mm')
      }
    },
    computed: {
      show: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      start() {
        return new Date(this.startDate + ' ' + this.startTime)
      },
      end() {
        return new Date(this.endDate + ' ' + this.endTime)
      }
    },
    watch: {},
    methods: {
      hide() {
        this.show = false
      },
      confirm() {
        this.finish({
          title: this.title,
          content: this.content,
          start: this.start,
          end: this.end
        })
        this.hide()
      }
    }
  };
</script>
<style lang="less">
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  input,
  textarea {
    outline: none;
    border: none;
    padding: 5px 0;
  }
  
  .border-top-1 {
    border-top: 1px solid #ddd;
  }
  
  .border-bottom-1 {
    border-bottom: 1px solid #ddd;
  }
  
  .border-bottom-0 {
    border-bottom: transparent;
  }
  
  .border-right-1 {
    border-right: 1px solid #ddd;
  }
  
  .activity-wrapper {
    font-size: 14px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: none;
    z-index: 10;
    .activity-body {
      width: 80%;
      z-index: 10;
      background: #fff;
      border-radius: 5px;
      padding-bottom: 20px;
      .activity-body-header {
        display: flex;
        justify-content: space-between;
        color: #555;
        padding: 8px 15px;
        .border-bottom-1;
      }
      .activity-event-container {
        margin: 20px 0;
        border-top: 1px solid #ddd;
        .border-bottom-1;
        padding-left: 15px;
        .activity-event-title {
          .border-bottom-1;
        }
      }
      .activity-settings {
        padding: 0 15px;
        .border-top-1;
        .border-bottom-1;
        li {
          display: flex;
          justify-content: space-between;
          .border-bottom-1;
          &:last-child {
            .border-bottom-0;
          }
          .datetime {
            .date {
              padding-right: 10px;
              .border-right-1;
            }
            .time {
              text-align: right;
              width: 44px;
            }
          }
        }
      }
    }
    &.in {
      display: flex;
      justify-content: center;
      align-items: center;
      .activity-mask {
        display: block;
      }
    }
    .activity-mask {
      background: rgba(0, 0, 0, .5);
      display: none;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      position: fixed;
      z-index: 9;
    }
  }
</style>