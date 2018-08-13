# Multiplatform project in Kotlin
One of the key capabilities of Kotlin's multiplatform code is a way for common code to depend on platform-specific declarations. 
Kotlin provides a mechanism of expected and actual declarations in which one module can define *expected declarations* and a platform specific module can provide the *actual declarations*.

Code, common amongst multiple platforms can be placed in common modules, while platform-specific code could be placed
into platform-specific modules, and expect/actual declarations can bind them together in developer-friendly way.

## Prerequisites
- `Kotlin` version 1.2.51.
- `Gradle` is the used build system ([how to install](https://gradle.org/install/)).

### 2. Multiplatform library for Node/JVM 
The multiplatform library will include three subprojects:
 * `common` - contains a common logic for both applications;
 * `js` - contains an Javascript specific implementation that can be imported as npm package in Node application;
 * `jvm` - contains a JVM specific implementation that can be imported by SpringBoot applications.
 
#### 2.1 Common subproject
The `common` subproject contains a platform-independent code. 

Create a `HelloWorld` class with the expected declaration *greeting*: 

    // common/src/main/kotlin/template/HelloWorld.kt
    package template
    
    expect class HelloWorld {
        fun greeting(firstName: String, lastName: String, platform: String): String
    }
    
Then create a `HelloWorldTemplate` class with the shared feature: 

    // common/src/main/kotlin/template/HelloWorldTemplate.kt
    package template
    
    class HelloWorldTemplate(val firstName: String, val lastName: String, val platform: String) {
        var template = "Hello World by $firstName $lastName from the amazing world of $platform!!"
    }
    
#### 2.2 JVM subproject
The `jvm` subproject contains a JVM-specific code. 

Create a `HelloWorld` class with the actual implementations: 

    // jvm/src/main/kotlin/template/HelloWorld.kt
    package template
    
    actual class HelloWorld {
        actual fun greeting(firstName: String, lastName: String, platform: String): String {
            return HelloWorldTemplate(firstName, lastName, platform).template
        }
    }
    
    fun helloWorld(firstName: String, lastName: String): String {
        return HelloWorld().greeting(firstName, lastName, "JAVA")
    }

#### 2.3 Javascript subproject
The `js` subproject contains a Javascript-specific code. 

Create a `HelloWorld` class with the actual implementations: 

    // js/src/main/kotlin/template/HelloWorld.kt
    package template
    
    actual class HelloWorld {
        actual fun greeting(firstName: String, lastName: String, platform: String): String {
            return HelloWorldTemplate(firstName, lastName, platform).template
        }
    }
    
    @JsName("helloWorld")
    fun helloWorld(firstName: String, lastName: String): String {
        return HelloWorld().greeting(firstName, lastName, "NODE")
    }

### 3. Proof of concept
In order to test the common libraries I've implemented 2 simple applications:
 * `node-app` - A Node JS application
 * `jvm-app` - A Java main class.

For the *js* module I suggest to build the library locally using command:

    npm install -g

Then on *node-app* folder install dependencies and run the application:

    npm install -g && npm start

#### 3.1 JVM Application
A simple standalone java application has been created:

    // jvm-app/src/main/java/template/jvm/HelloWorldJVM.java
    package template.jvm;
    
    import static template.HelloWorldKt.helloWorld;
    
    public class HelloWorldJVM {
        public static void main(String[] args){
            System.out.print(helloWorld("Lorenzo", "Martino"));
        }
    }
    
Running the application the following output is shown:

    > Task :jvm-app:HelloWorldJVM.main()
    Hello World by Lorenzo Martino from the amazing world of JAVA!!
    BUILD SUCCESSFUL in 0s 
    
#### 3.2 Node Application
A simple node application has been created (see `node-app` folder). 
In the following abstract the interaction with the npm library:

    // node-app/app.js
    ...
    var greeting = require('hello-world-local');
    console.log(greeting.template.helloWorld("Lorenzo", "Martino"));
    ...
    
Running the application the following output is shown:

    > node-app@0.0.0 start C:\Users\eomlrar\gitlab\multiplatform-templates-poc\node-app
    > node ./bin/www
    
    Hello World by Lorenzo Martino from the amazing world of NODE!!
   