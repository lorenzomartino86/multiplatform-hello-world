package template

actual class HelloWorld {
    actual fun greeting(firstName: String, lastName: String, platform: String): String {
        return HelloWorldTemplate(firstName, lastName, platform).template
    }
}

fun helloWorld(firstName: String, lastName: String): String {
    return HelloWorld().greeting(firstName, lastName, "JAVA")
}