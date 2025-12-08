---
title: Spring IOC原理
createTime: 2025/11/29 17:50:50
permalink: /java/spring/bwxyul37/
---

## 一、BeanFactory
### 1. 简介

***BeanFactory接口*** 定义了IOC容器的基本功能，控制反转、基本的依赖注入、直至 Bean 的生命周期的各种功能，都由它的实现类提供。

### 2. 核心实现类 - DefaultListableBeanFactory

`DefaultListableBeanFactory`是BeanFactory 接口体系的**完整实现类**，具备IOC容器的**基本功能：**
  - Bean存储管理、依赖注入实现、Bean生命周期管理、Bean查找和注册等IOC容器的基本功能；
  - 大部分 `ApplicationContext` 的实现类都组合了 `DefaultListableBeanFactory` 以实现IOC容器的相关功能。

其UML图如下：
![alt text](DefaultListableBeanFactoryUML.png)

:::details 示例：利用底层API手动组装IOC容器

1. 环境准备
```java
    @Configuration
    public static class Config {
        @Bean
        public Bean1 bean1(){
            return new Bean1();
        }
        @Bean
        public Bean2 bean2() {
            return new Bean2();
        }

    }

    public static class Bean1 {
        @Resource
        private Bean2 bean2;
        public Bean2 getBean2() {
            return bean2;
        }
    }

    public static class Bean2 {

    }
```


2. 最基础的IOC容器：
```java
public void main() {
        // 1. 创建Spring IOC容器（Bean工厂）
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();

        // 2. 注册Bean
        AbstractBeanDefinition beanDefinition = BeanDefinitionBuilder.genericBeanDefinition(Config.class).getBeanDefinition();
        beanFactory.registerBeanDefinition("config", beanDefinition);

        // 3. 打印所有Bean
        Arrays.stream(beanFactory.getBeanDefinitionNames()).forEach(System.out::println);
    }
```

3. 添加Bean工厂后置处理器，支持处理@Configuration、@Bean等注解
```java
    public void main() { 
        // 1. 创建Spring IOC容器（Bean工厂）
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();
        // 2. 注册Bean
        AbstractBeanDefinition beanDefinition = BeanDefinitionBuilder.genericBeanDefinition(Config.class).getBeanDefinition();
        beanFactory.registerBeanDefinition("config", beanDefinition);

        // 3. 给BeanFactory添加一些注解开发常用的的后处理器
        AnnotationConfigUtils.registerAnnotationConfigProcessors(beanFactory);
        // 4. 给BeanFactory注册IOC容器中的所有BeanFactory后处理器
        beanFactory.getBeansOfType(BeanFactoryPostProcessor.class).values().forEach(beanFactoryPostProcessor ->
                beanFactoryPostProcessor.postProcessBeanFactory(beanFactory)
        );
        System.out.println("---------------注册BeanFactory后处理器后-------------");
        Arrays.stream(beanFactory.getBeanDefinitionNames()).forEach(System.out::println);
        System.out.println("bean1依赖注入是否成功：" + beanFactory.getBean(Bean1.class).getBean2());
    }
```

4. 添加Bean后置处理器，支持处理@Autowired、@Resource等依赖注入注解
```java
    static void beanPostProcessor() {
        // 1. 创建Spring IOC容器（Bean工厂）
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();
        // 2. 注册Bean
        AbstractBeanDefinition beanDefinition = BeanDefinitionBuilder.genericBeanDefinition(Config.class).getBeanDefinition();
        beanFactory.registerBeanDefinition("config", beanDefinition);

        // 3. 给BeanFactory添加一些注解开发常用的的后处理器
        AnnotationConfigUtils.registerAnnotationConfigProcessors(beanFactory);
        // 4. 给BeanFactory注册IOC容器中的所有BeanFactory后处理器
        beanFactory.getBeansOfType(BeanFactoryPostProcessor.class).values().forEach(beanFactoryPostProcessor ->
                beanFactoryPostProcessor.postProcessBeanFactory(beanFactory)
        );
        // 5. 为Bean注册Bean后处理器
        beanFactory.getBeansOfType(BeanPostProcessor.class).values().forEach(beanFactory::addBeanPostProcessor);
        System.out.println("---------------注册BeanFactory后处理器、Bean后处理器后-------------");
        Arrays.stream(beanFactory.getBeanDefinitionNames()).forEach(System.out::println);
        System.out.println("bean1依赖注入是否成功：" + beanFactory.getBean(Bean1.class).getBean2());
    }
```

:::
## 二、ApplicationContext

### 1. 概述
- `ApplicationContext`：其实现类组合并扩展了 BeanFactory 的功能，不仅如此，此接口还提供了国际化翻译、事件发布、资源加载、环境变量等功能，部分实现类如下：

    - 其UML图如下：
        ![alt text](ApplicationContextUML.png)

### 2. 实现类

:::details ClassPathXmlApplicationContext - 基于类路径 XML 配置

```java
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("abc.xml");
        for (String beanDefinitionName : applicationContext.getBeanDefinitionNames()) {
            System.out.println(beanDefinitionName);
        }
    }
    static class Bean1 {
        private Bean2 bean2;
        // setter方法，xml文件依赖注入需要
        public void setBean2(Bean2 bean2) {
            this.bean2 = bean2;
        }
    }
    static class Bean2 {}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="bean1" class="com.summer.ioc.ApplicationContextDemo$Bean1">
        <property name="bean2" ref="bean2"></property>
    </bean>

    <bean id="bean2" class="com.summer.ioc.ApplicationContextDemo$Bean2"></bean>

</beans>
```
:::

:::details FileSystemXmlApplicationContext - 文件系统路径 XML 配置

```java
    public static void main(String[] args) {
        ApplicationContext applicationContext = new FileSystemXmlApplicationContext("D:\\java\\mycode\\spring-learning\\spring-thory\\src\\main\\resources\\abc.xml");
        // 也可以使用绝对路径，但是工作目录必须设置对(这里工作目录是spring-thory的父级目录)
        // ApplicationContext applicationContext = new FileSystemXmlApplicationContext("spring-thory\\src\\main\\resources\\abc.xml");
        for (String beanDefinitionName : applicationContext.getBeanDefinitionNames()) {
            System.out.println(beanDefinitionName);
        }
    }
```

:::

:::details AnnotationConfigApplicationContext - 基于注解配置

```java
    public static void main(String[] args) {
        AnnotationConfigApplicationContext applicationContext = new AnnotationConfigApplicationContext(Config.class);
        for (String beanDefinitionName : applicationContext.getBeanDefinitionNames()) {
            System.out.println(beanDefinitionName);
        }
    }
    @Configuration
    static class Config {
        @Bean
        public Bean1 bean1() {
            return new Bean1();
        }
        @Bean
        public Bean2 bean2() {
            return new Bean2();
        }
    }
```

打印：
```text
org.springframework.context.annotation.internalConfigurationAnnotationProcessor
org.springframework.context.annotation.internalAutowiredAnnotationProcessor
org.springframework.context.annotation.internalCommonAnnotationProcessor
org.springframework.context.event.internalEventListenerProcessor
org.springframework.context.event.internalEventListenerFactory
applicationContextDemo.Config
bean1
bean2
```
:::

:::details ApplicationContext -集成ServletWeb容器

```java
package com.summer.ioc;

import org.springframework.boot.autoconfigure.web.servlet.DispatcherServletRegistrationBean;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.DispatcherServlet;
import org.springframework.web.servlet.mvc.Controller;


public class AnnotationConfigServletWebServerApplicationContextDemo {
    public static void main(String[] args) {
        AnnotationConfigServletWebServerApplicationContext applicationContext
                = new AnnotationConfigServletWebServerApplicationContext(WebConfig.class);
    }

    // 手动创建能处理简单请求的Web容器
    @Configuration
    static class WebConfig {
        @Bean
        public ServletWebServerFactory servletWebServerFactory() {
            return new TomcatServletWebServerFactory();
        }
        @Bean
        public DispatcherServlet dispatcherServlet() {
            return new DispatcherServlet();
        }
        @Bean
        public DispatcherServletRegistrationBean registrationBean(DispatcherServlet dispatcherServlet) {
            return new DispatcherServletRegistrationBean(dispatcherServlet, "/");
        }

        @Bean("/hello")
        public Controller helloController() {
            return (request, response) -> {
                response.getWriter().print("hello servlet Web!");
                return null;
            };
        }
    }
}

```
访问 http://localhost:8080/hello 即可

:::

::: details GenericApplicationContext "干净"的容器
`GenericApplicationContext:` 通用编程式容器，提供最灵活的Bean注册与生命周期控制。

```java

```

:::

原理：

:::details XML开发原理

ClassPathXmlApplicationContext 与 FileSystemXmlApplicationContext 的原理:
```java
    public static void main(String[] args) {
        // 1. 创建BeanFactory实现
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();
        // 2. 使用对应的工具加载Bean定义文件
        XmlBeanDefinitionReader xmlBeanDefinitionReader = new XmlBeanDefinitionReader(beanFactory);
        // xmlBeanDefinitionReader.loadBeanDefinitions("abc.xml");
        // 从文件系统读取配置:
        xmlBeanDefinitionReader.loadBeanDefinitions(new FileSystemResource("spring-thory\\src\\main\\resources\\abc.xml"));

        // 成功注册xml中的Bean, 打印:
        for (String beanDefinitionName : beanFactory.getBeanDefinitionNames()) {
            System.out.println(beanDefinitionName);
        }
    }
```

:::


:::details XML结合注解开发原理

1. `AnnotationConfigApplicationContext 的原理`: 观察demo的打印结果，我们发现多出了几个除了Config、bean1、bean2外的bean；这些Bean是==AnnotationConfigApplicationContext内部已帮我们注册好的BeanFactory后处理器、Bean后处理器，用于支持注解开发==。

2. 使用xml也支持注解开发，但需在xml文件中加入以下配置来注册这些BeanFactory后处理器、Bean后处理器：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"  // [!code ++]
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context https://www.springframework.org/schema/context/spring-context.xsd">
    
    <context:annotation-config/> // [!code ++]
    <bean id="bean1" class="com.summer.ioc.ApplicationContextDemo$Bean1">
        <property name="bean2" ref="bean2"></property>
    </bean>

    <bean id="bean2" class="com.summer.ioc.ApplicationContextDemo$Bean2"></bean>

</beans>
```

:::

### 3. 功能

- 国际化
- 资源
- 环境
- 事件发布

## 三、后处理器

### 1. Bean生命周期
- 实例化
- 依赖注入
- 初始化
- 销毁
其中，依赖注入、初始化、销毁阶段需要加上一些Bean后处理器来完成。
:::details Bean生命周期
```java
@Component
public class LifecycleBean {

    public LifecycleBean() {
        System.out.println("Lifecycle 实例化....");
    }

    @Autowired
    public void injectTest(@Value("JAVA_HOME") String javaHome) {
        System.out.println("Lifecycle 依赖注入; 注入属性：" + javaHome);
    }

    @PostConstruct
    public void init() {
        System.out.println("Lifecycle 初始化方法...");
    }
    
    @PreDestroy
    public void destroy() {
        System.out.println("Lifecycle 销毁方法...");
    }
}

```
:::

### 2. BeanPostProcessor
`Bean 后处理器`：针对Bean生命周期的各个阶段提供拓展，如处理@Autowired、@Resource等注解；

:::details 自定义Bean后处理器

定义Bean后处理器：
```java
public class MyBeanPostProcessor implements InstantiationAwareBeanPostProcessor, DestructionAwareBeanPostProcessor {
    private static final Logger log = LoggerFactory.getLogger(MyBeanPostProcessor.class);

    @Override
    public void postProcessBeforeDestruction(Object o, String s) throws BeansException {
        log.info("<<<<<< bean销毁之前执行，如 @PreDestroy");
    }

    @Override
    public Object postProcessBeforeInstantiation(Class<?> beanClass, String beanName) throws BeansException {
        log.info("<<<<<< 实例化之前执行，这里返回的对象会替换掉原本的bean");
        return null;
    }

    @Override
    public boolean postProcessAfterInstantiation(Object bean, String beanName) throws BeansException {
        log.info("<<<<<< 实例化之后执行，这里如果返回false会跳过依赖注入阶段");
        return true;
    }

    @Override
    public PropertyValues postProcessProperties(PropertyValues pvs, Object bean, String beanName) throws BeansException {
        log.info("<<<<<< 依赖注入阶段执行，如 @Autowire、@Value、@Resource");
        return pvs;
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        log.info("<<<<<< 初始化之前执行，这里返回的对象会替换掉原本的bean，如 @PostConstruct、@ConfigurationProperties");
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        log.info("<<<<<< 初始化之后执行，这里返回的对象会替换掉原本的bean，如代理增强");
        return InstantiationAwareBeanPostProcessor.super.postProcessAfterInitialization(bean, beanName);
    }
}

```

注册相关Bean、Bean后处理器并启动容器：
```java
    public static void main(String[] args) {
        GenericApplicationContext context = new GenericApplicationContext();
        context.registerBean("lifecycleBean", LifecycleBean.class);
        // 注册我们自定义的BeanPostProcessor
        context.registerBean(MyBeanPostProcessor.class);

        context.refresh();
        context.close();
    }
```

打印：
```text
23:17:28.843 [main] INFO com.summer.ioc.lifecycle.MyBeanPostProcessor - <<<<<< 实例化之前执行，这里返回的对象会替换掉原本的bean
Lifecycle 实例化....
23:17:28.845 [main] INFO com.summer.ioc.lifecycle.MyBeanPostProcessor - <<<<<< 实例化之后执行，这里如果返回false会跳过依赖注入阶段
23:17:28.845 [main] INFO com.summer.ioc.lifecycle.MyBeanPostProcessor - <<<<<< 依赖注入阶段执行，如 @Autowire、@Value、@Resource
23:17:28.845 [main] INFO com.summer.ioc.lifecycle.MyBeanPostProcessor - <<<<<< 初始化之前执行，这里返回的对象会替换掉原本的bean，如 @PostConstruct、@ConfigurationProperties
23:17:28.845 [main] INFO com.summer.ioc.lifecycle.MyBeanPostProcessor - <<<<<< 初始化之后执行，这里返回的对象会替换掉原本的bean，如代理增强
23:17:28.894 [main] DEBUG org.springframework.context.support.GenericApplicationContext - Closing org.springframework.context.support.GenericApplicationContext@6adca536, started on Mon Dec 08 23:17:28 CST 2025
23:17:28.895 [main] INFO com.summer.ioc.lifecycle.MyBeanPostProcessor - <<<<<< bean销毁之前执行，如 @PreDestroy

```
这里的Autowire等依赖注入失败，是因为还未使用相关的BeanPostProcessor，详见下一节。
:::
### 3. BeanFactoryPostProcessor
`BeanFactory 后处理器`：为BeanFactory 提供了扩展功能；



:::details 后置处理器示例

`DefaultListableBeanFactory`默认是支持XML配置的方式开发的，但若要支持注解开发，需要通过以下方式委托相关后置处理器实现：

```java
// 给BeanFactory添加一些注解开发常用的的后处理器
AnnotationConfigUtils.registerAnnotationConfigProcessors(beanFactory);
```
```text
// 通过AnnotationConfigUtils.registerAnnotationConfigProcessors注册的后置处理器
org.springframework.context.annotation.internalConfigurationAnnotationProcessor  --> BeanFactory后处理器，处理@Configuration注解
org.springframework.context.annotation.internalAutowiredAnnotationProcessor  --> Bean后处理器， 处理@Autowired注解
org.springframework.context.annotation.internalCommonAnnotationProcessor  --> Bean后处理器 处理@Resource注解
......
```

:::