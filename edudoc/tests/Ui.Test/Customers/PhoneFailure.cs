using NUnit.Framework;
using OpenQA.Selenium;
using Ui.Tests.Utilities;

namespace Ui.Tests.Customers
{
    [TestFixture]
    public class PhoneFailure
    {
        private readonly IWebDriver _driver;
        private readonly string _baseUrl;
        private readonly TestSetup _setup;


        public PhoneFailure()
        {
            _setup = new TestSetup();
            _driver = _setup.Driver;
            _baseUrl = _setup.BaseUrl;
        }


        [Test]
        public void ThePhoneFailureTest()
        {
            _setup.DoLogin();
            _driver.Navigate().GoToUrl(_baseUrl + "/#/customer/list");
            _driver.FindElement(By.CssSelector("td.ellipsis.ng-binding")).Click();
            _driver.FindElement(By.XPath("//customer-phone-info-component/div/h4")).Click();
            _driver.FindElement(By.Id("inputPhone")).Clear();
            _driver.FindElement(By.Id("inputPhone")).SendKeys("(123) 4__-____ Ext _____");
            _driver.FindElement(By.XPath("//customer-phone-info-component//button[@type='submit']")).Click();
            Assert.IsTrue(_driver.FindElement(By.CssSelector(".has-error")).Displayed);
            _setup.TeardownTest();
        }
    }
}
