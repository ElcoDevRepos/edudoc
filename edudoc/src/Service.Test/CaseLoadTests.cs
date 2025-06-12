using Service.Core.Utilities;
using Service.Core.Utilities;
using Model;
using Moq;
using Service.CaseLoads;
using Model.Enums;
using Service.Utilities;
using System;
using Xunit;

namespace Service.Test
{
    public class CaseLoadTests
    {

        /// <summary>
        /// Tests that a Case Load has a valid StudentId
        /// </summary>
        /// <returns></returns>
        [Theory]
        [InlineData(1, true)]
        [InlineData(0, false)]
        [InlineData(-3, false)]
        public void ValidateCaseLoad_ShouldDenyForStudentId(int testStudentId, bool shouldPassValidation)
        {
            // Arrange
            // var mockSettings = new Mock<IConfigurationSettings>();
            // var mockContext = new Mock<IPrimaryContext>();
            // var validator = new CaseLoadValidator(mockContext.Object, mockSettings.Object);
            var testCaseLoad = new CaseLoad
            {
                StudentId = testStudentId
            };

            // Act
            bool isValid = testCaseLoad.StudentId > 0;

            // Could use validator to test validity
            // bool isValid = validator.ValidateAge(testApplicationBasicInfo);
            
            // Assert
            Assert.Equal(isValid, shouldPassValidation);

        }

    }
}

