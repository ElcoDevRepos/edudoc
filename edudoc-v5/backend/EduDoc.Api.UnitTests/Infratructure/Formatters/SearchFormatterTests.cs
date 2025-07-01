using EduDoc.Api.Endpoints.Students.Mappers;
using EduDoc.Api.Infrastructure.Formatters;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EduDoc.Api.UnitTests.Infratructure.Formatters
{
    public class SearchFormatterTests
    {
        private readonly SearchFormatter _formatter;

        public SearchFormatterTests()
        {
            _formatter = new SearchFormatter();
        }

        [Fact]
        public void Format_ShouldTrimString_WhenEmptySpace()
        {
            Assert.Equal(String.Empty, this._formatter.Format("   "));
        }

        [Fact]
        public void Format_ShouldReturnEmpty_WhenNull()
        {
            Assert.Equal(String.Empty, this._formatter.Format(null));
        }

        [Fact]
        public void Format_ShouldTrimSpace_WhenStringNotNull()
        {
            Assert.Equal("input", this._formatter.Format(" input "));
        }
    }
}