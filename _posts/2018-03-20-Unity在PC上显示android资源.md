## PC上切换成Android格式加载资源出现的问题
我们通常在PC上使用Unity时候，加载android格式的assetbundle时候会出现一大片粉色的样子。如同下面的样子。![问题图片.png](https://upload-images.jianshu.io/upload_images/10954538-90b5cb8d832c5790.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这个样子的时候，外面有时候需要去看一些特效在android上是否正确的时候，就是看不了的。

## 修改方法

在Unity的PlayerSetting 里面，找到Auto Graphics API for windows。取消勾选。![TIM截图20180320151248.png](https://upload-images.jianshu.io/upload_images/10954538-7c97fc109eb0f423.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
在里面添加OpenGL es2，并且置于最上方。
![TIM截图20180320151402.png](https://upload-images.jianshu.io/upload_images/10954538-125a6cfadb1d4fff.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
等待unity上面的顶栏出现了OpenGL es2.0的字样，就是说明可以用了。![TIM截图20180320151549.png](https://upload-images.jianshu.io/upload_images/10954538-21ff783567a583c7.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
放一张成功了的图片。
![TIM截图20180320151741.png](https://upload-images.jianshu.io/upload_images/10954538-f48a9cafb5f2784c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
