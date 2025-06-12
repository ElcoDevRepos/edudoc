using NUnit.Framework;
using OpenQA.Selenium;
using Ui.Tests.Utilities;

namespace Ui.Tests.Customers
{
    [TestFixture]
    public class LoginFailure
    {
        private readonly IWebDriver _driver;
        private readonly string _baseUrl;
        private readonly TestSetup _setup;


        public LoginFailure()
        {
            _setup = new TestSetup();
            _driver = _setup.Driver;
            _baseUrl = _setup.BaseUrl;
        }


        [Test]
        public void TheLoginFailureTest()
        {
            _driver.Navigate().GoToUrl(_baseUrl + "/#/login");
            _driver.FindElement(By.XPath("//input[@type='text']")).SendKeys("notareal");
            _driver.FindElement(By.XPath("//input[@type='password']")).SendKeys("username");
            _driver.FindElement(By.XPath("//button[@type='submit']")).Click();
            Assert.IsTrue(IsElementPresent(By.CssSelector("div.toast-error")));
            _setup.TeardownTest(false);
        }

        private bool IsElementPresent(By by)
        {
            try
            {
                _driver.FindElement(by);
                return true;
            }
            catch (NoSuchElementException)
            {
                return false;
            }
        }
    }
}
