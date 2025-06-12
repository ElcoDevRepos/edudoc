using Model;
using Model.Partials.Interfaces;

namespace Service.Base.Validation
{
    /// <summary>
    /// Provides extension methods for common validation methods.
    /// </summary>
    public static class BasicRuleBuilderExtensions
    {
        /// <summary>
        /// Generates a validator for the given named entity that checks that the name isn't empty.
        /// </summary>
        /// <typeparam name="T">Type for the entity to validate</typeparam>
        /// <param name="obj">Instance of the entity.  Unused in any logic, only here to provide a convenient syntax for getting the validator.</param>
        /// <returns>A validator for the given type</returns>
        public static BasicNameEntityValidator<T> GenerateBasicNameValidator<T>(this T obj)
            where T : IBasicNameEntity
        {
            return new BasicNameEntityValidator<T>();
        }

        /// <summary>
        /// Generates a validator for the given entity that checks that the entity's start date is before it's end date.
        /// </summary>
        /// <typeparam name="T">Type for the entity to validate</typeparam>
        /// <param name="obj">Instance of the entity.  Unused in any logic, only here to provide a convenient syntax for getting the validator.</param>
        /// <returns>A validator for the given type</returns>
        public static StartEndDateValidator<T> GenerateStartEndDateValidator<T>(this T obj)
            where T : IHasStartEndDate
        {
            return new StartEndDateValidator<T>();
        }
    }
}
