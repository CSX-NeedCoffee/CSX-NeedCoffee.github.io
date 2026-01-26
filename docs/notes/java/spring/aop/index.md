---
title: Spring AOP
createTime: 2026/01/18 16:29:26
permalink: /java/spring/6qnobh1a/
---

## 一、AOP简介

### 1. 概念

- `切点`：通过切点表达式或其他方式定义需要增强的方法；
- `通知`：定义增强方式（前置、后置、环绕等）以及增强逻辑；
- `切面`：切点 + 通知
  - Advisor：低级切面，只包含一组通知 + 切点，在Spring中只能通过编程式创建；
  - Aspect：高级切面，包含多组通知 + 切点，在Spring中通过声明式（注解）创建。

### 2. AOP实现的三种方式

#### 1. **动态代理**

(1) JDK动态代理

- 基于接口实现，只能代理目标类的接口方法；
- 代理类和目标类是兄弟关系；

:::details 示例
```java
import java.lang.reflect.Proxy;
import java.util.concurrent.Callable;

public class Demo {

    static class Target implements Callable<String> {
        @Override
        public String call() {
            return "call run ...";
        }
    }

    public static void main(String[] args) throws Exception {
        Target target = new Target();

        // 需要使用类加载器加载动态生成的代理类字节码
        ClassLoader classLoader = target.getClass().getClassLoader();
        // 目标类实现的接口列表
        Class<?>[] interfaces = target.getClass().getInterfaces();
        Callable<?> proxy = (Callable<?>) Proxy.newProxyInstance(classLoader, interfaces, (p, method, args1) -> {
            // 参数p是代理对象，参数method是目标对象的Method，参数args1是目标对象方法参数
            System.out.println("所有方法的前置增强...");
            // 反射调用目标
            Object res = method.invoke(target, args1);
            System.out.println(method.getName() + "方法执行结果：" + res);
            System.out.println("所有方法的后置增强...");
           return res;
        });

        proxy.call();
    }
}

```
:::

(2) cglib动态代理
- 基于继承实现，代理类与目标类为子父关系；
- 目标类或代理方法不能为final；

:::details 示例
```java
public class Demo {
    static class Target{
        public String call() {
            return "call run ...";
        }
    }

    public static void main(String[] args1) {
        Target t = new Target();
        Target proxy = (Target) Enhancer.create(Target.class, (MethodInterceptor) (p, method, args, methodProxy) -> {
            System.out.println("所有方法前置增强");
            // 通过methodProxy调用目标方法，是非反射调用，效率更高
            var res = methodProxy.invoke(t,  args);
            System.out.println("执行结果：" + res);
            System.out.println("所有方法后置增强");
            return res;
        });
        
        proxy.call();
    }
}
```
:::

#### 2. **静态代理**
(1)  ACJ编译器（maven插件）
- 在`编译时`织入增强方法，运行效率更高；

:::details 开发步骤

- 切面类无需Spring IOC管理；（只需@Aspect注解，无需@Component等注解）
- 添加 aspectj-maven-plugin插件；
```xml :collapsed-lines=2"
    <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>aspectj-maven-plugin</artifactId>
        <version>1.14.0</version>
        <configuration>
            <complianceLevel>1.8</complianceLevel>
            <source>1.8</source>
            <target>1.8</target>
            <showWeaveInfo>true</showWeaveInfo>
            <verbose>true</verbose>
            <Xlint>ignore</Xlint>
            <encoding>UTF-8</encoding>
        </configuration>
        <executions>
            <execution>
                <goals>
                    <goal>compile</goal>
                    <goal>test-compile</goal>
                </goals>
            </execution>
        </executions>
    </plugin>
```
- 确保使用maven编译，而不是javac。

:::

(2)  Java agent技术

- 同样切面类无需Spring IOC管理；
- 加上jvm参数：`-javaagent:\xxx\xxx\aspectjweaver-1.9.7.jar`

对比：
<c-table
  :columns="[
    { title: '特性', key: 'feature' },
    { title: 'Spring AOP 动态代理', key: 'SpringAop' },
    { title: 'AspectJ 编译时编织', key: 'aspcetJ' },
    { title: 'AspectJ 加载时编织', key: 'agent' }
  ]"
  :data="[
    { feature: '代理类型', SpringAop: '动态代理', aspcetJ: '静态代理', agent: '静态代理' },
    { feature: '时机', SpringAop: '运行时', aspcetJ: '编译时', agent: '类加载时' },
    { feature: '性能', SpringAop: '有运行时开销', aspcetJ: '性能最好', agent: '有类加载开销' },
    { feature: '支持范围', SpringAop: '仅Spring管理的Bean', aspcetJ: '所有Java类', agent: '所有Java类' },
  ]"
/>


## 二. 编程式实现AOP步骤

### 1. 创建切点

```java :collapsed-lines=8
// 方法匹配
AspectJExpressionPointcut pt1 = new AspectJExpressionPointcut();
pt1.setExpression("execution(* foo(..))");
// 注解匹配
AspectJExpressionPointcut pt2 = new AspectJExpressionPointcut();
pt2.setExpression("@annotation(org.springframework.transaction.annotation.Transactional)");
// 自定义匹配方式
StaticMethodMatcherPointcut pt3 = new StaticMethodMatcherPointcut() {
  @Override
  public boolean matches(Method method, Class<?> targetClass) {
    // 判断方法或者类上是否有@Transactional注解
    if (MergedAnnotations.from(method).isPresent(Transactional.class)) {
      return true;
    }
    // 判断 类/父类/接口 上是否有@Transactional注解
    else if (MergedAnnotations.from(targetClass, MergedAnnotations.SearchStrategy.TYPE_HIERARCHY).isPresent(Transactional.class)) {
      return true;
    }
    return false;
  }
};
```
:::details 切点匹配 API 示例

```java
    public static void main(String[] args) throws NoSuchMethodException {
        //1. 方法匹配
        AspectJExpressionPointcut pt1 = new AspectJExpressionPointcut();
        pt1.setExpression("execution(* foo(..))");
        boolean isMatch = pt1.matches(Bean1.class.getMethod("foo"), Bean1.class);
        System.out.println("is match: " + isMatch); // true

        //2. 注解匹配
        AspectJExpressionPointcut pt2 = new AspectJExpressionPointcut();
        pt2.setExpression("@annotation(org.springframework.transaction.annotation.Transactional)");
        isMatch = pt2.matches(Bean1.class.getMethod("bar"), Bean1.class);
        System.out.println("is match: " + isMatch); // true

        //3. 自定义匹配方式
        StaticMethodMatcherPointcut pt3 = new StaticMethodMatcherPointcut() {
            @Override
            public boolean matches(Method method, Class<?> targetClass) {
                // 判断方法或者类上是否有@Transactional注解
                if (MergedAnnotations.from(method).isPresent(Transactional.class)) {
                    return true;
                }
                // 判断 类/父类/接口 上是否有@Transactional注解
                else if (MergedAnnotations.from(targetClass, MergedAnnotations.SearchStrategy.TYPE_HIERARCHY).isPresent(Transactional.class)) {
                    return true;
                }
                return false;
            }
        };

        boolean isMatch1 = pt3.matches(Bean3.class.getMethod("bar"), Bean3.class);
        boolean isMatch2 = pt3.matches(Bean3.class.getMethod("foo"), Bean3.class);
        boolean isMatch3 = pt3.matches(Bean3.class.getMethod("zoo"), Bean3.class);
        // 接口上有注解，那么所有方法都匹配
        System.out.println("is match1: " + isMatch1); // true
        System.out.println("is match2: " + isMatch2); // true
        System.out.println("is match3: " + isMatch3); // true
    }

    private static class Bean1{
        public void foo() {
            System.out.println("bean2 foo...");
        }

        @Transactional
        public void bar() {
            System.out.println("bean1 bar...");
        }
    }

    @Transactional
    private static class Bean2{
        public void foo() {
            System.out.println("bean2 foo...");
        }
        public void bar() {
            System.out.println("bean2 bar...");
        }
    }

    @Transactional
    private interface I{
        void foo();
        void bar();
    }
    private static class Bean3 implements I{
        @Override
        public void foo() {
            System.out.println("bean2 foo...");
        }
        @Override
        public void bar() {
            System.out.println("bean2 bar...");
        }

        public void zoo() {
            System.out.println("bean2 baz...");
        }
    }
```

:::

### 2. 创建通知

```java
  // 此API为环绕通知，所有类型的通知底层都将转化为此通知
  MethodInterceptor advice = invocation -> {
      System.out.println("before...");
      Object result = invocation.proceed();
      System.out.println("after...");
      return result;
  };
```

### 3. 创建切面
```java
// 一个基础的切面实现类，传入切点与通知
DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor(pointcut, advice);
```

### 4. 创建Bean代理

```java
  // ProxyFactory: Spring提供的，专门用于创建代理的工厂类创建代理
  ProxyFactory proxyFactory = new ProxyFactory();
  proxyFactory.setTarget(bean1); // 目标对象
  proxyFactory.addAdvisor(advisor); // 切面
```

:::details Spring是如何选择代理的？
```text
检查 proxyFactory.isProxyTargetClass()
    ↓ 如果为true → 强制使用CGLIB
    ↓ 如果为false → 继续判断
    ↓
检查 proxyFactory.getProxiedInterfaces()
    ↓ 如果有接口 → JDK动态代理
    ↓ 如果没有接口 → CGLIB（因为没有接口只能用CGLIB）
```
:::

### 5. 执行代理方法
```java
  I proxy = (I) proxyFactory.getProxy();
  proxy.foo();
  proxy.bar();
```

:::details 完整实现示例
```java
    public static void main(String[] args) {

        //1. 创建切点
        // 通过切点表达式创建切点
        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression("execution(* foo())"); // 匹配所有foo方法

        //2. 创建通知
        // 此API为环绕通知，所有类型的通知底层都将转化为此通知
        MethodInterceptor advice = invocation -> {
            System.out.println("before...");
            Object result = invocation.proceed();
            System.out.println("after...");
            return result;
        };

        //3. 创建切面
        // Spring中比较基础的切面
        DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor(pointcut, advice);

        //4. 创建Bean代理
        // ProxyFactory: Spring提供的，专门用于创建代理的工厂类创建代理
        // 其内部会自动根据目录类情况自动选择创建代理的方式
        Bean1 bean1 = new Bean1(); // 假设这是IOC中存在增强方法的某个Bean
        ProxyFactory proxyFactory = new ProxyFactory();
        proxyFactory.setTarget(bean1);
        proxyFactory.addAdvisor(advisor);

        //5. 获取代理，执行增强方法
        I proxy = (I) proxyFactory.getProxy();
        proxy.foo();
        proxy.bar();
        System.out.println(proxy.getClass());
    }

    public interface I{
        void foo();
        void bar();
    }
    public static class Bean1 implements I{
        @Override
        public void foo() {
            System.out.println("bean1 foo...");
        }
        @Override
        public void bar() {
            System.out.println("bean1 bar...");
        }
    }
```
:::

## 三、注解式实现AOP


### 1. AnnotationAwareAspectJAutoProxyCreator 介绍

此类是实现注解开发AOP的关键类，作用如下：
```text
- 解析@Aspect、@Before等AOP注解；
- 为IOC中需要增强的Bean创建代理。
```

此类属于Bean后处理器，为Bean创建代理时机如下：

```text
创建 -> (*) -> 依赖注入 -> 初始化 -> (*)
- 若无循环依赖，则在第一个 * 处；
- 若有循环依赖，则在第二个 * 处。
```

此类实现注解开发AOP的关键方法如下：
```text
- findEligibleAdvisors: 为当前Bean找出符合条件的切面；
- wrapIfNecessary: 调用`findEligibleAdvisors`方法找出符合条件的切面，创建代理，若没有符合条件的切面，则创建原始Bean；
```

:::details 示例

没有加 AnnotationAwareAspectJAutoProxyCreator
```java :collapsed-lines=7

public class Main {
    public static void main(String[] args) {
        // 1. 创建容器
        GenericApplicationContext context = new GenericApplicationContext();
        // 2. 注册后处理器
        // 处理@Bean等注解的后处理器
        context.registerBean(ConfigurationClassPostProcessor.class);

        // 3. 注册Bean
        // 切面
        context.registerBean(Aspect1.class);
        context.registerBean(Config.class);
        // 包含AOP增强方法的Bean
        context.registerBean("bean1", Bean1.class);

        // 4. 启动容器
        context.refresh();

        // 5. 获取Bean1
        Bean1 bean1 = (Bean1) context.getBean("bean1");
        System.out.println("---bean1: " + bean1.getClass());
        bean1.foo();

        // 6. 关闭容器
        context.close();
    }

    // 高级切面
    @Aspect
    private static class Aspect1 {

        @Before("execution(* foo())")
        public void before() {
            System.out.println("Aspect1 before...");
        }

        @After("execution(* foo())")
        public void after() {
            System.out.println("Aspect1 after...");
        }
    }

    private static  class Config{

        // 低级切面
        @Bean
        public DefaultPointcutAdvisor advisor() {
            // 创建切点
            AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
            pointcut.setExpression("execution(* foo())");
            //2. 创建通知
            // 此API为环绕通知，所有类型的通知底层都将转化为此通知
            MethodInterceptor advice = invocation -> {
                System.out.println("Advisor before...");
                Object result = invocation.proceed();
                System.out.println("Advisor after...");
                return result;
            };

            // 3. 返回低级切面
            return new DefaultPointcutAdvisor(pointcut, advice);
        }
    }

    public static class Bean1 {
        public void foo() {
            System.out.println("bean1 foo...");
        }
    }
}

```
打印：
```text
---bean1: class com.summer.aop.advisorParse.Main$Bean1
bean1 foo...
```

加了 AnnotationAwareAspectJAutoProxyCreator
```java
public class Main {
    public static void main(String[] args) {
        // 1. 创建容器
        GenericApplicationContext context = new GenericApplicationContext();
        // 2. 注册后处理器
        // 处理@Bean等注解的后处理器
        context.registerBean(ConfigurationClassPostProcessor.class);
        // AOP注解解析与自动代理创建器 // [!code ++]
        context.registerBean(AnnotationAwareAspectJAutoProxyCreator.class); // [!code ++]
        // ......
    }
}

```
打印：
```text
---bean1: class com.summer.aop.advisorParse.Main$Bean1$$EnhancerBySpringCGLIB$$cf574b8c
Advisor before...
Aspect1 before...
bean1 foo...
Aspect1 after...
Advisor after...
```
:::

### 2. 注解式实现AOP原理

- `step1`: 扫描所有@Aspect注解（高级切面）


:::details `step2`: 高级切面转为Advisor，并注入到IOC容器中

`AnnotationAwareAspectJAutoProxyCreator`处理器找到@Aspect注解的Bean，将此Bean中的所有@Before、@After、@Around注解解析为一个个Advisor:

```text
@Before
    → Advisor {
        pointcut: AspectJExpressionPointcut,
        advice: AspectJMethodBeforeAdvice
    }

@After
    → Advisor {
        pointcut: AspectJExpressionPointcut,
        advice: AspectJAfterAdvice
    }

@Around
    → Advisor {
        pointcut: AspectJExpressionPointcut,
        advice: AspectJAroundAdvice
    }

@AfterReturning
    → Advisor {
        pointcut: AspectJExpressionPointcut,
        advice: AspectJAfterReturningAdvice
    }

@AfterThrowing
    → Advisor {
        pointcut: AspectJExpressionPointcut,
        advice: AspectJAfterThrowingAdvice
    }
    
```
- 切点：`AspectJExpressionPointcut`
- 通知：`AspectJ***Advice`
- Advisor：`InstantiationModelAwarePointcutAdvisorImpl`（教程中为`DefaultPointcutAdvisor`）


示例代码：
```java :collapsed-lines=3
public class Main {

  // 模拟Spring IOC容器
  private final List<Object> list = new ArrayList<>();

  public static void main(String[] args) {
    // 1. 扫描加了@Aspect注解的类（这里假设找到了Aspect1）
    Object o = new Aspect1();

    // 收集所有Advisor的列表
    List<Advisor> list = new ArrayList<>();
    // 代理实例工厂
    var proxyInstanceFactory = new SimpleAspectInstanceFactory(o.getClass());

    Method[] methods = o.getClass().getMethods();
    for (Method method : methods) {
      // 2. 解析@Before注解，创建对应的Advisor存入IOC中
      if (MergedAnnotations.from(method).isPresent(Before.class)) {
        // 2.1 创建切点
        AspectJExpressionPointcut pt = new AspectJExpressionPointcut();
        pt.setExpression(method.getAnnotation(Before.class).value());
        // 2.2 创建通知
        AspectJMethodBeforeAdvice advice = new AspectJMethodBeforeAdvice(method, pt, proxyInstanceFactory);
        // 2.3 创建切面
        DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor(pt, advice);
        // 2.4 存入IOC容器中
        list.add(advisor);
      }
      if (MergedAnnotations.from(method).isPresent(After.class)) {
        // 2.1 创建切点
        AspectJExpressionPointcut pt = new AspectJExpressionPointcut();
        pt.setExpression(method.getAnnotation(After.class).value());
        // 2.2 创建通知
        AspectJAfterAdvice advice = new AspectJAfterAdvice(method, pt, proxyInstanceFactory);
        // 2.3 创建切面
        DefaultPointcutAdvisor advisor = new DefaultPointcutAdvisor(pt, advice);
        // 2.4 存入IOC容器中
        list.add(advisor);
      }
      // 解析其他注解......
    }

    list.forEach(System.out::println);
  }

  @Aspect
  private static class Aspect1 {

    @Before("execution(* foo())")
    public void before() {
      System.out.println("Aspect1 before...");
    }

    @After("execution(* foo())")
    public void after() {
      System.out.println("Aspect1 after...");
    }
  }
}

```
- 将解析完成后的Advisor添加到IOC容器中：
:::

:::details `step3`: 注册Bean时判断当前Bean是否需要创建代理

`AnnotationAwareAspectJAutoProxyCreator`处理器会调用`wrapIfNecessary`方法判断是否需要为此Bean创建代理，其内部会通过`findEligibleAdvisors` 为当前Bean找出符合条件的Advisor, 若没有符合条件的Advisor，则后续将不创建代理

:::

:::details `step4`: 对需要增强的Bean创建代理

- `step4.1`：其他通知统一转为MethodInterceptor；
- `step4.2`：为Bean生成代理，注入到IOC容器中：


```java
// 统一转换的动作实在 ProxyFactory 内部完成的，感兴趣的可以查看源码，此处仅展示转换后的结果
// 3. 创建代理时将非环绕通知类型转为环绕通知
ProxyFactory proxyFactory = new ProxyFactory();
// 假设为IOC中的 Bean1 创建代理
proxyFactory.setTarget(new Bean1());
proxyFactory.addAdvisors(list);
// 此方法可以获取此代理的所有通知，打印即可发现@Before和@After通知被转为了环绕通知
var adlist = proxyFactory.getInterceptorsAndDynamicInterceptionAdvice(Bean1.class.getMethod("foo"), Bean1.class);
System.out.println("转换后的通知类型>>>>>>>>>>>>>>>>");
adlist.forEach(System.out::println);
```

---

以下适配器会将==不属于环绕通==知的通知转为MethodInterceptor (其子类)
- `MethodBeforeAdviceAdapter`: 将 AspectJMethodBeforeAdvice 转为 MethodBeforeAdviceInterceptor
- `AfterReturningAdviceAdapter`：将 AspectJAfterReturningAdvice 转为 AfterReturningAdviceInterceptor
- ...

```java
// 适配器源码：
class MethodBeforeAdviceAdapter implements AdvisorAdapter {

    // 如果属于前置通知，则通过getInterceptor方法转为MethodInterceptor
    @Override
    public boolean supportsAdvice(Advice advice) {
        return (advice instanceof MethodBeforeAdvice);
    }

    @Override
    public MethodInterceptor getInterceptor(Advisor advisor) {
        MethodBeforeAdvice advice = (MethodBeforeAdvice) advisor.getAdvice();
        return new MethodBeforeAdviceInterceptor(advice);
    }
}

// @Before 的转换链条：
// @Before → AspectJMethodBeforeAdvice → MethodBeforeAdviceInterceptor
```
Q & A：
1. 为什么要统一转为MethodInterceptor呢？
    - 答：为了方便后续调用链执行。因为当有多个通知时，是需要以环状层层嵌套的方式执行多个增强方法的，每一个`MethodInterceptor`都是一层环，由外到内执行。（见2.6）
2. 为什么不在Step1将切面转为MethodInterceptor再添加到IOC容器中呢？
    - 答：问了AI说是Spring框架的 “定义与执行分离” 设计原则；但也可能是历史原因，才设计适配器用于转换。

:::

:::details `step5`: 调用代理方法时，触发增强方法执行链
执行调用链是由 `MethodInvocation` 类实现的：
```java
        // 4. 模拟执行调用链
        MethodInvocation methodInvocation = new ReflectiveMethodInvocation(
                null, // 代理对象
                bean1, // 目标对象
                Bean1.class.getMethod("foo"), // 增强方法
                new Object[0], // 方法参数
                Bean1.class,
                adlist
        );
        // 执行调用链
        methodInvocation.proceed();
```
在调用之前需要添加 `ExposeInvocationInterceptor.INSTANCE` 作为第一个Advisor，其作用是将 `methodInvocation` 对象放入线程变量中，以便后续的Advisor会使用到。
```java
// ...
proxyFactory.addAdvisor(ExposeInvocationInterceptor.INSTANCE);
proxyFactory.addAdvisors(list);
```
:::

:::tip 责任链模式

调用链的实现原理就用到了 `责任链模式`，其中 `MethodInvocation` 就是责任链，其内部保存着 `List<MethodInterceptor>`， 列表中的元素就是责任链中的节点，
通过 `MethodInvocation` 的proceed() 方法，配合`MethodInterceptor`的`invoke`方法实现递归调用，从而实现了责任链设计模式。

:::
## 附录 AOP API
```text
MergedAnnotations：Spring提供的注解工具类：

// 查看方法上是否存在注解
MergedAnnotations.from(Method对象).isPresent(注解.class)

// 查看类上是否存在注解 
MergedAnnotations.from(Class对象).isPresent(注解.class)

// 查看类、其父类、其实现的接口上是否存在注解 
MergedAnnotations.from(Class对象, MergedAnnotations.SearchStrategy.TYPE_HIERARCHY) 
    
```