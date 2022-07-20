const ASSETS_TYPE = ['component', 'filter', 'directive'];

export default function initAssetRegisters (Vue) {
  ASSETS_TYPE.forEach(type => {
    Vue[type] = function (id, definition) {
      if (type === 'component') {
        definition = this.options._base.extend(definition);
      }
      this.options[type + 's'][id] = definition;
    }
  })
}
// todo 思维导图（组件化）   剩余原理学习  周末完成   下周vuex vue-router原理  复习vue原理
