using System;
using System.Linq;
using FluentValidation;
using Model;
using Model.Enums;

namespace Service.CaseLoads
{
    public class CaseLoadValidator : AbstractValidator<CaseLoad>
    {
        private IPrimaryContext _context;

        public CaseLoadValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(cl => cl)
                .Must(NotOverlapDates)
                .WithMessage(
                    "Save Failed: IEP Start Date overlaps another service type assignment."
                );
            RuleFor(cl => cl)
                .Must(cl => cl.IepStartDate < cl.IepEndDate || cl.Archived)
                .WithMessage("IEP Start date should be less than or equal to IEP End date")
                .When(cl => cl.IepStartDate != null && cl.IepEndDate != null);
            RuleFor(cl => cl)
                .Must(BeUnique)
                .WithMessage("There can only be one IEP caseload per student")
                .When(cl => cl.StudentTypeId == (int)StudentTypes.IEP && !cl.Archived);
        }

        private bool BeUnique(CaseLoad caseLoad)
        {
            return !_context.CaseLoads.Any(cl =>
                cl.Id != caseLoad.Id
                && !cl.Archived
                && cl.StudentId == caseLoad.StudentId
                && cl.ServiceCodeId == caseLoad.ServiceCodeId
                && cl.StudentTypeId == caseLoad.StudentTypeId
            );
        }

        private bool NotOverlapDates(CaseLoad caseLoad)
        {
            return caseLoad.Archived
                || (caseLoad.IepStartDate == null && caseLoad.IepEndDate == null)
                || !_context.CaseLoads.Any(cl =>
                    cl.StudentId == caseLoad.StudentId
                    && !cl.Archived
                    && cl.Id != caseLoad.Id
                    && cl.ServiceCodeId == caseLoad.ServiceCodeId
                    && (
                        (
                            (
                                caseLoad.IepStartDate < cl.IepStartDate
                                && (
                                    caseLoad.IepEndDate > cl.IepStartDate
                                    || caseLoad.IepEndDate == null
                                )
                            )
                            || (
                                caseLoad.IepStartDate > cl.IepStartDate
                                && (cl.IepEndDate > caseLoad.IepStartDate || cl.IepEndDate == null)
                            )
                        )
                        || (
                            (
                                caseLoad.IepEndDate > cl.IepEndDate
                                && (
                                    caseLoad.IepStartDate < cl.IepEndDate
                                    || caseLoad.IepStartDate == null
                                )
                            )
                            || (
                                caseLoad.IepEndDate < cl.IepEndDate
                                && (cl.IepStartDate < cl.IepEndDate || cl.IepStartDate == null)
                            )
                        )
                        || (
                            (cl.IepStartDate == null && cl.IepEndDate == null)
                            || (caseLoad.IepStartDate == null && caseLoad.IepEndDate == null)
                        )
                    )
                );
        }
    }
}
