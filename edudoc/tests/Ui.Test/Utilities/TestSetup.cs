using System;
using System.Configuration;
using System.Text;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.UI;

namespace Ui.Tests.Utilities
{
    internal class TestSetup
    {
        private StringBuilder _verificationErrors;
        public string BaseUrl;

        public IWebDriver Driver;
        public WebDriverWait FiveSecWait;

        public TestSetup()
        {
            SetupTest();
        }

        /// <summary>
        ///     Configure Driver and wait options for use in testing
        /// </summary>
        [SetUp]
        public void SetupTest()
        {
            InitDriver();
            Driver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(10);
            FiveSecWait = new WebDriverWait(Driver, TimeSpan.FromSeconds(5)); //This is an explicit wait
            BaseUrl = AppSettings.GetAdminSite();
            _verificationErrors = new StringBuilder();
        }

        // TODO: Add IE support
        /// <summary>
        ///     Load the driver for testing based on the configuration in the app.config.
        ///     Currently doesn't support IE
        /// </summary>
        private void InitDriver()
        {
            switch (ConfigurationManager.AppSettings["TestingBrowser"].ToLower())
            {
                case "ff":
                    InitFf();
                    break;
                case "ch":
                    InitCh();
                    break;
                default:
                    break;
            }
        }

        private void InitFf()
        {
            var options = new FirefoxOptions
            {
                BrowserExecutableLocation = ConfigurationManager.AppSettings["BrowserExecutable"]
            };
            Driver = new FirefoxDriver(options);
        }

        private void InitCh()
        {
            var options = new ChromeOptions
            {
                BinaryLocation = ConfigurationManager.AppSettings["BrowserExecutable"]
            };
            Driver = new ChromeDriver(options);
        }

        [TearDown]
        public void TeardownTest(bool doLogout = true)
        {
            if (doLogout)
                DoLogout();
            try
            {
                Driver.Quit();
            }
            catch (Exception)
            {
                // Ignore errors if unable to close the browser
            }
            Assert.AreEqual("", _verificationErrors.ToString());
        }


        private void DoLogout()
        {
            Driver.FindElement(By.ClassName("user-menu")).Click();
            Driver.FindElement(By.XPath("//li[@id='user-header-footer-combo']/button"));
        }

        public void DoLogin()
        {
            Driver.Navigate().GoToUrl(BaseUrl + "/#/login");
            Driver.FindElement(By.XPath("//input[@type='text']")).Clear();
            Driver.FindElement(By.XPath("//input[@type='text']")).SendKeys("admin");
            Driver.FindElement(By.XPath("//input[@type='password']")).Clear();
            Driver.FindElement(By.XPath("//input[@type='password']")).SendKeys("admin");
            Driver.FindElement(By.XPath("//button[@type='submit']")).Click();
        }
    }
}