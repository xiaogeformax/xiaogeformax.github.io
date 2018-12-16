## 建立一个raymarching
![图片.png](https://upload-images.jianshu.io/upload_images/10954538-c4e61b5594c7e562.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
[shadertoy 查看][1]


先解释一波 **raymarching**, Raymatching是一种计算机图形渲染方式，但它的潜力仍未被完全发掘。Raymatching一般用于渲染体积纹理、高度图以及解析曲面。如今，大多数游戏用OpenGL或Direct3D（DirectX）来使用显卡的硬件加速器绘制多边形，电脑可以以每秒60帧的速度渲染几百万个三角面。虽然Raymatching没有那些图形API那么出名，但它可以仅用两个三角面实现无与伦比的细节。

## 创建一个camera
我们需要去定义camera的origin,target,和up 就是定义摄像机的起源,目标位置,还有就是定义向上的位置。

    vec3 cameraOrigin = vec3(2.0, 3.0, 2.0);
    vec3 cameraTarget = vec3(0.0, 0.0, 0.0);
    vec3 upDirection = vec3(0.0, 1.0, 0.0);

然后就可以得出摄像机的发向是

    vec3 cameraDir = normalize(cameraTarget - cameraOrigin);

由此可以计算出摄像机的右方向和顶上的方向。

    vec3 cameraRight = normalize(cross(upDirection, cameraOrigin));
    vec3 cameraUp = cross(cameraDir, cameraRight);

下面对屏幕坐标进行转化，把屏幕坐标放缩到-1到1之间。

    vec2 screenPos = -1.0 + 2.0 * gl_FragCoord.xy / iResolution.xy; // screenPos can range from -1 to 1
    screenPos.x *= iResolution.x / iResolution.y; // Correct aspect ratio
    
在知道了摄像机的方向之后，我们来计算出ray的方向。

    vec3 rayDir = normalize(cameraRight * screenPos.x + cameraUp * screenPos.y + cameraDir);

## Raymarching loop

在 marching 里面 先来设置步进的光线总长度 

    const int MAX_ITER = 100; 
物体的离摄像机的最大范围 

    const float MAX_DIST = 20.0;
设置物体离光线的阈值距离

    const float EPSILON = 0.001;
    
下面是loop的代码：在个里面点会被转化为和交集的东西。

     // The raymarching loop
    float totalDist = 0.0;
    vec3 pos = cameraOrigin;
    float dist = EPSILON;
    
    // trying to find a point of intersection 
    for (int i = 0; i < MAX_ITER; i++)
    {
        // Either we've hit the object or hit nothing at all, either way we should break out of the loop
        if (dist < EPSILON || totalDist > MAX_DIST)
        break; // If you use windows and the shader isn't working properly, change this to continue;
    
        dist = distfunc(pos); // Evalulate the distance at the current point
        totalDist += dist;
        pos += dist * rayDir; // Advance the point forwards in the ray direction by the distance
    }
##  定义显示的模型

    float sphere(vec3 pos, float radius)
    {
    	return length(pos) - radius;
    }
    
    float box(vec3 pos, vec3 size)
    {
        return length(max(abs(pos) - size, 0.0));
    }

## 定义一下Lighting
光也要在EPSILON的距离里面

    if (dist < EPSILON)
    {
        // Lighting code
    }
    else
    {
    	gl_FragColor = vec4(0.0);
    }

光函数里面需要取得表面着色器的normal向量,可以用点来预计算出点的位置。

    vec2 eps = vec2(0.0, EPSILON);
    vec3 normal = normalize(vec3(
    	distfunc(pos + eps.yxx) - distfunc(pos - eps.yxx),
    	distfunc(pos + eps.xyx) - distfunc(pos - eps.xyx),
    	distfunc(pos + eps.xxy) - distfunc(pos - eps.xxy)));

由光照公式可以得出

      fragColor = vec4(ambientColor +
                          lambertian * diffuseColor +
                          specular * specColor, 1.0);

[shadertoy 查看][1]


  [1]: https://www.shadertoy.com/view/MtdfRs