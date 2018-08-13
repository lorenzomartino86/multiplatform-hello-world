package template

import org.junit.Test
import kotlin.test.assertTrue

class HelloWorldTest {
    @Test
    fun givenFirstNameAndSecondName_whenCreateHelloWorldTemplate_thenJavaTemplateIsCreated() {
    val template = helloWorld("Foo", "Bar")
        assertTrue(template.equals("Hello World by Foo Bar from the amazing world of NODE!!"))
    }
}