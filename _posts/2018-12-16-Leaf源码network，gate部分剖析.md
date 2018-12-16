#Leaf源码network，gate部分剖析

##Leaf 简介

**Leaf** 是一个由 Go 语言（golang）编写的开发效率和执行效率并重的开源游戏服务器框架。Leaf 适用于各类游戏服务器的开发，包括 H5（HTML5）游戏服务器。

## Gate 模块

Gate模块是网关模块，负责游戏客户端的接入。是在接入时候创建一个Agent，把socket流变成msg，分发给相应的模块。

### Agent 接口
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181216180758615.png?)

### Gate下面的run函数
Run函数会分发消息
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181216181123443.png?)

## NetWork 模块
NetWork 模块是网络相关的，使用 TCP 和 WebSocket 协议，可自定义消息格式。
下面来看下network的源码把，主要分析Tcp部分，Webwork部分同理，暂不分析了。

### Coon 接口
由于同时可以Websocket和Tcp两种协议，然后这里使用了同一个接口。这里对消息的读写，关闭，删除。还有远程网络地址。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181216182041268.png?)

在TcpCoon里面有每个函数的具体实现。


## tcp_msg 脚本
这里主要是对于Tcp的具体消息进行封装，分析。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181216183410946.png)
里面有设置消息长度，同时对于数据的精度也有处理，有math.MaxUint8等不同数据精度的数据处理。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181216183907552.png)

之前的Conn的read的write的读写消息的部分也具体放在了tcp_msg里面了。同时也针对了大小端进行了处理，对数据的长度做出了限定。
```go
func (p *MsgParser) Read(conn *TCPConn) ([]byte, error) {
    var b [4]byte
    bufMsgLen := b[:p.lenMsgLen]

    // read len
    if _, err := io.ReadFull(conn, bufMsgLen); err != nil {
        return nil, err
    }

    // parse len
    var msgLen uint32
    switch p.lenMsgLen {
    case 1:
        msgLen = uint32(bufMsgLen[0])
    case 2:
        if p.littleEndian {
            msgLen = uint32(binary.LittleEndian.Uint16(bufMsgLen))
        } else {
            msgLen = uint32(binary.BigEndian.Uint16(bufMsgLen))
        }
    case 4:
        if p.littleEndian {
            msgLen = binary.LittleEndian.Uint32(bufMsgLen)
        } else {
            msgLen = binary.BigEndian.Uint32(bufMsgLen)
        }
    }

    //check len
    if msgLen>p.maxMsgLen{
        return nil,errors.New("message too long")
    } else if msgLen < p.minMsgLen {
        return nil, errors.New("message too short")
    }
    msgData := make([]byte, msgLen)
    if _, err := io.ReadFull(conn, msgData); err != nil {
        return nil, err
    }
    return msgData,nil
}

```

Write 函数里面先对大小端判断处理，然后对其长度也做了些处理，最后还是在coon写入到coon里面，这里就是tcp_coon的write里面。
```go
// goroutine safe
func (p *MsgParser) Write(conn *TCPConn, args ...[]byte) error {
    // get len
    var msgLen uint32
    for i := 0; i < len(args); i++ {
        msgLen += uint32(len(args[i]))
    }
    // check len
    if msgLen > p.maxMsgLen {
        return nil
    } else if msgLen < p.minMsgLen {
        return nil
    }

    msg := make([]byte, uint32(p.lenMsgLen)+msgLen)

    // write len
    switch p.lenMsgLen {
    case 1:
        msg[0] = byte(msgLen)
    case 2:
        if p.littleEndian {
            binary.LittleEndian.PutUint16(msg, uint16(msgLen))
        } else {
            binary.BigEndian.PutUint16(msg, uint16(msgLen))
        }
    case 4:
        if p.littleEndian {
            binary.LittleEndian.PutUint32(msg, msgLen)
        } else {
            binary.BigEndian.PutUint32(msg, msgLen)
        }
    }
    // write data
    l := p.lenMsgLen
    for i := 0; i < len(args); i++ {
        copy(msg[l:], args[i])
        l += len(args[i])
    }

    conn.Write(msg)  //最后将msg发送出去

    return nil

}
```
大概上面的流程就是这个样子。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181216185616280.png)




## tcp_server脚本

tcp_server 里面启动是由gate模块的gate启动的，然后在由Start进行开始。

Start函数先初始化一个init函数,然后让server 在线程里面运行。init 里面限定连接数和最大pending数量。
```go
func (server *TCPServer) Start() {
    server.init()
    go server.run()
}

func (server *TCPServer) init() {
    ln, err := net.Listen("tcp", server.Addr)
    if err != nil {
        log.Fatal("%v", err)
    }

    if server.MaxConnNum <= 0 {
        server.MaxConnNum = 100
        log.Info("invalid MaxConnNum,reset to %v", server.MaxConnNum)
    }
    if server.PendingWriteNum <= 0 {
        server.PendingWriteNum = 100
        log.Info("invalid PendingWriteNum, reset to %v", server.PendingWriteNum)
    }
    if server.NewAgent == nil {
        log.Fatal("NewAgent must not be nil")
    }

    server.ln = ln
    server.conns = make(ConnSet)

    // msg parser
    msgParser := NewMsgParser()
    msgParser.SetMsgLen(server.LenMsgLen, server.MinMsgLen, server.MaxMsgLen)
    msgParser.SetByteOrder(server.LittleEndian)
    server.msgParser = msgParser
}
```

在Run函数里面，把conn放在conns来同时管理。同时在这里生产Agent，同时agent.run然后是在agent中处理的。

```go
func (server *TCPServer) run() {
    server.wgLn.Add(1)
    defer server.wgLn.Done()

    var tempDelay time.Duration

    for {
        conn, err := server.ln.Accept()
        if err != nil {
            if ne, ok := err.(net.Error); ok && ne.Temporary() {
                if tempDelay == 0 {
                    tempDelay = 5 * time.Millisecond
                } else {
                    tempDelay *= 2
                }
                if max := 1 * time.Second; tempDelay > max {
                    tempDelay = max
                }
                log.Info("accept error: %v; retrying in %v", err, tempDelay)
                time.Sleep(tempDelay)
                continue
            }
            return
        }
        tempDelay = 0

        server.mutexConns.Lock()
        if len(server.conns) >= server.MaxConnNum {
            server.mutexConns.Unlock()
            conn.Close()
            log.Debug("too many connections")
            continue
        }
        //将conn放入conns中，用于后期close的处理
        server.conns[conn] = struct{}{}
        server.mutexConns.Unlock()

        server.wgConns.Add(1)

        tcpConn := newTCPCoon(conn, server.PendingWriteNum, server.msgParser)
        fmt.Println("new conn  from ", tcpConn.RemoteAddr())
        agent := server.NewAgent(tcpConn) //将tcpconn生成agent

        go func() {
            agent.Run()

            //cleanup
            tcpConn.Close()
            server.mutexConns.Lock()
            delete(server.conns, conn)
            server.mutexConns.Unlock()
            agent.OnClose()

            server.wgConns.Done()
        }()
    }
}
```
大致主要的流程如下图。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181216191928919.png)

下面我模仿了一个grpc的go框架
[go框架]("https://github.com/xiaogeformax/MagicseaServer")