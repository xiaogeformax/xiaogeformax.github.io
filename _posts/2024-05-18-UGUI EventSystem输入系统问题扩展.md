
### UGUI EventSystem输入系统问题
希望button上 text 单独相应事件
创建一个Button，那这个Button还包含了Text组件，如果text.RaycastTarget勾上
当鼠标点击的时候会调用GetEventHandler函数，
该函数的root参数其实是Text，发现text无IEventSystemHandler组件
但是会查找到它的父物体Button，发现有，然后调用Button的点击事件
核心问题：text缺少IEventSystemHandler
public class Button : Selectable, IPointerClickHandler, ISubmitHandler
public interface IPointerClickHandler : IEventSystemHandler
点击button，先响应text，再查找到button，handlerCount为0，说明无IPointerClickHandler组件

需要给text加上EventTrigger，会响应text的点击事件，不会向上响应button

### 使用unity自带的事件系统检测3d物体

完整流程
1. 添加Event System到场景中。
1. 在主相机上添加 Physics Raycaster 组件。
1. 确保3D物体有Collider组件。
1. 给3D物体添加 EventTrigger 组件。
1. 配置 EventTrigger 事件，调用自定义的处理函数。

### 主相机上添加 Physics Raycaster 组件

具体作用, Physics Raycaster 的具体步骤：
1. 射线投射：当用户在屏幕上点击或移动鼠标时，Physics Raycaster 会从相机位置向点击点投射一条射线。
1. 检测碰撞：射线会检测场景中的3D物体（这些物体需要有Collider组件），并判断是否有物体与射线相交。
1. 事件传递：如果射线与某个物体相交，Physics Raycaster 会将该信息传递给事件系统。事件系统会调用物体上相应的事件处理接口（如 IPointerClickHandler.OnPointerClick）。

