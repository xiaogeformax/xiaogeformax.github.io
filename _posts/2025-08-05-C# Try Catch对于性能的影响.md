## 一段C# try catch的代码
```
	int a = 10;
	try
	{
		a = Convert.ToInt32("Try");
	}
	catch (Exception ex1)
	{
		a = 20;
	}
```
IL反编译后的代码段
```
.method private hidebysig static void Main(string[] args) cil managed
{
    .entrypoint
    .maxstack 2
    .locals init (
        [0] int32 a,
        [1] class [System.Runtime]System.Exception ex1
    )
    
    IL_0000: nop
    IL_0001: ldc.i4.s 10        // 加载常量10到栈
    IL_0003: stloc.0            // 将10存储到局部变量a (a = 10)
    
    .try
    {
        IL_0004: nop
        IL_0005: ldstr "Try"     // 加载字符串"Try"到栈
        IL_000a: call int32 [System.Runtime]System.Convert::ToInt32(string)
        IL_000f: stloc.0         // 将转换结果存储到变量a
        IL_0010: nop
        IL_0011: leave.s IL_001e // 正常退出try块
    }
    catch [System.Runtime]System.Exception
    {
        IL_0013: stloc.1         // 将异常对象存储到ex1
        IL_0014: nop
        IL_0015: ldc.i4.s 20     // 加载常量20到栈
        IL_0017: stloc.0         // 将20存储到变量a (a = 20)
        IL_0018: nop
        IL_0019: leave.s IL_001e // 退出catch块
    }
    
    IL_001e: ret                // 方法返回
}
```

// 大致的性能差异（相对时间）
**正常执行:        1x
TryParse方式:    1.2x
异常抛出:        1000-10000x  // 慢1000-10000倍**

## 异常情况 - 开销很大
```
// 异常情况 - 开销很大
    try
    {
        int result = Convert.ToInt32("Try"); // 抛出异常
    }
    catch (FormatException ex)
    {

        // 异常处理开销包括：
        // 1. 创建异常对象
        // 2. 收集调用栈信息
        // 3. 栈展开(Stack Unwinding)
        // 4. 查找匹配的catch块
    }
```




## 对于数值转化可以使用TryParse避免异常
```
// 正确做法 - 使用TryParse避免异常
for (int i = 0; i < userInputs.Length; i++)
{
    if (int.TryParse(userInputs[i], out int value))
    {
        // 处理成功情况
    }
    else
    {
        // 处理失败情况 - 无异常开销
    }
}
```
