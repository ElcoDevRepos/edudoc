using System;
using System.Linq;
using FluentValidation;
using Model;
using Model.Enums;

namespace Service.Encounters.Referrals
{
    public class SupervisorProviderStudentReferalSignOffValidator
        : AbstractValidator<SupervisorProviderStudentReferalSignOff>
    {
        protected readonly IPrimaryContext _context;

        public SupervisorProviderStudentReferalSignOffValidator(IPrimaryContext context)
        {
            _context = context;
            RuleFor(referral => referral.EffectiveDateFrom)
                .Must(BeBeforeDateTo)
                .WithMessage("Save Failed: Referral effective date must not be in the future.")
                .Must(NotOverlap)
                .WithMessage("Save Failed: Referral effective dates overlaps.");
            RuleFor(referral => referral.EffectiveDateTo)
                .Must(BeAfterDateTo)
                .WithMessage("Save Failed: Referral effective date must not be in the future.")
                .Must(NotOverlapActive)
                .WithMessage("Save Failed: Referral effective dates overlaps.");
        }

        private bool NotOverlap(
            SupervisorProviderStudentReferalSignOff referral,
            DateTime? effectiveDateFrom
        )
        {
            if (
                referral.ServiceCodeId == (int)ServiceCodes.Physical_Therapy
                || referral.ServiceCodeId == (int)ServiceCodes.Occupational_Therapy
            )
            {
                return true;
            }

            var overlap = _context.SupervisorProviderStudentReferalSignOffs.Any(existingReferral =>
                referral.Id != existingReferral.Id
                && referral.StudentId == existingReferral.StudentId
                && referral.ServiceCodeId == existingReferral.ServiceCodeId
                && effectiveDateFrom != null
                && existingReferral.EffectiveDateTo != null
                && (
                    existingReferral.EffectiveDateFrom > effectiveDateFrom
                    || (
                        existingReferral.EffectiveDateFrom < effectiveDateFrom
                        && existingReferral.EffectiveDateTo > effectiveDateFrom
                    )
                )
            );
            return !overlap;
        }

        private bool BeBeforeDateTo(
            SupervisorProviderStudentReferalSignOff referral,
            DateTime? effectiveDateFrom
        )
        {
            return !(
                referral.EffectiveDateTo != null
                && effectiveDateFrom.GetValueOrDefault() > referral.EffectiveDateTo
            );
        }

        private bool BeAfterDateTo(
            SupervisorProviderStudentReferalSignOff referral,
            DateTime? effectiveDateTo
        )
        {
            return effectiveDateTo == null
                || !(
                    referral.EffectiveDateFrom != null
                    && referral.EffectiveDateTo != null
                    && referral.EffectiveDateFrom > effectiveDateTo.GetValueOrDefault()
                );
        }

        private bool NotOverlapActive(
            SupervisorProviderStudentReferalSignOff referral,
            DateTime? effectiveDateTo
        )
        {
            if (
                referral.ServiceCodeId == (int)ServiceCodes.Physical_Therapy
                || referral.ServiceCodeId == (int)ServiceCodes.Occupational_Therapy
            )
            {
                return true;
            }

            var overlap = _context.SupervisorProviderStudentReferalSignOffs.Any(existingReferral =>
                referral.Id != existingReferral.Id
                && referral.StudentId == existingReferral.StudentId
                && referral.ServiceCodeId == existingReferral.ServiceCodeId
                && effectiveDateTo != null
                && (
                    existingReferral.EffectiveDateFrom < effectiveDateTo
                        && existingReferral.EffectiveDateTo == null
                    || (
                        existingReferral.EffectiveDateFrom < effectiveDateTo
                        && existingReferral.EffectiveDateTo > effectiveDateTo
                    )
                )
            );
            return !overlap;
        }
    }
}
