using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using Ui.Tests.Utilities;

namespace Ui.Tests.Customers
{
    [TestFixture]
    public class AddCustomerFailure
    {
        private readonly IWebDriver _driver;
        private readonly string _baseUrl;
        private readonly TestSetup _setup;

        public AddCustomerFailure()
        {
            _setup = new TestSetup();
            _driver = _setup.Driver;
            _baseUrl = _setup.BaseUrl;
        }

        [Test]
        public void TheAddCustomerFailureTest()
        {
            _setup.DoLogin();
            _driver.Navigate().GoToUrl(_baseUrl + "/#/customer/list");
            _setup.FiveSecWait.Until(
                ExpectedConditions.ElementIsVisible(By.CssSelector("span.fa.fa-plus")));
            _driver.FindElement(By.CssSelector("span.fa.fa-plus")).Click();
            _driver.FindElement(By.CssSelector("button.btn.btn-success")).Click();
            Assert.IsTrue(_driver.FindElement(By.CssSelector("span.errorText")).Displayed);
            _setup.TeardownTest();
        }
    }
}