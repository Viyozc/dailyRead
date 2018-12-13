
#### Timer params
```javascript
var timeoutID = scope.setTimeout(function[, delay, param1, param2, ...]);
var timeoutID = scope.setTimeout(function[, delay]);
var timeoutID = scope.setTimeout(code[, delay]);

// example
setTimeout(console.log, 100, 'hello')
```


2. #### Promise
```javascript
// MDN
p.then(onFulfilled[, onRejected]);
p.then((value) => {
  // fulfillment
}, (reason) => {
  // rejection
});

// example
Promise.reject()
  .then( () => {
    throw new Error('Oh no!');
  })
  .then( () => { 
    console.log( 'Not called.' );
  }, error => {
    console.error( 'onRejected function called'); // result output
  }).catch(e => {
    console.log('catch err')
  });

```


3. #### Mobx

Mobx的一些坑
通过autorun的实现原理可以发现，会出现很多我们想象中应该触发，但是没有触发的场景，例如：
1. 无法收集新增的属性
```javascript
const Mobx = require("mobx");
const { observable, autorun } = Mobx;
let ob = observable({ a: 1, b: 1 });
autorun(() => {
  if(ob.c){
    console.log("ob.c:", ob.c);
  }
});
ob.c = 1
```

对于该问题，可以通过extendObservable(target, props)方法来实现。
```javascript
const Mobx = require("mobx");
const { observable, autorun, computed, extendObservable } = Mobx;
var numbers = observable({ a: 1, b: 2 });
extendObservable(numbers, { c: 1 });
autorun(() => console.log(numbers.c));
numbers.c = 3;
// 1
// 3
```

extendObservable该API会可以为对象新增加observal属性。
当然，如果你对变量的entry增删非常关心，应该使用Map数据结构而不是Object。

 mobx在严格模式下，不允许在 action 外更改任何状态。但是不同版本严格模式的用法不同，3.x、4.x、5.x三个版本下的严格模式用法。

1、mobx@3.x：useStrict(boolean)
2、mobx@4.x：configure({ enforceActions: boolean })
迁移说明：https://github.com/mobxjs/mobx/wiki/Migrating-from-mobx-3-to-mobx-4#things-that-just-have-moved
3、mobx@5.x：configure({ enforceActions: value })

mobx@5.x之后enforceActions不再接收boolean值，传入boolean值会提示如下错误：


可接收的值为：

- "never" (默认): 可以在任意地方修改状态
- "observed": 在某处观察到的所有状态都需要通过动作进行更改。在正式应用中推荐此严格模式。
- "always": 状态始终需要通过动作来更新(实际上还包括创建)。

Mobx + React 响应式组件
observer 函数/装饰器可以用来将 React 组件转变成响应式组件。 它用 mobx.autorun 包装了组件的 render 函数以确保任何组件渲染中使用的数据变化时都可以强制刷新组件。 observer 是由单独的 mobx-react 包提供的。

> 值需要通过引用来传递而不是通过(字面量)值来传递。

```javascript
@observer
class Login extends React.Component<LoginProps, LoginState> {
  @observable name: string;
  age: number;
  children: Array<string> = [];
  state: IState = {

  }
  render () {
    return (
      <div>
        <Button onClick={() => this.name = '测试'}>{this.name || '无'}</Button>
        {this.children.map(item => <p key={item}>{item}</p>)}
      </div>
    );
  }
}

```

```
import {observer} from "mobx-react";

const Timer = observer(({ timerData }) =>
    <span>Seconds passed: { timerData.secondsPassed } </span>
);
```

### JS

```javascript
function throttle(func, delay) {
    var delay = delay || 1000;
    var previousDate = new Date();
    var previous = previousDate.getTime();  // 初始化一个时间，也作为高频率事件判断事件间隔的变量，通过闭包进行保存。
    
    return function(args) {
        var context = this;
        var nowDate = new Date();
        var now = nowDate.getTime();
        if (now - previous >= delay) {  // 如果本次触发和上次触发的时间间隔超过设定的时间
            func.call(context, args);  // 就执行事件处理函数 （eventHandler）
            previous = now;  // 然后将本次的触发时间，作为下次触发事件的参考时间。
        }
    }
}

```