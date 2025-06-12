using BreckServiceBase.Utilities.Interfaces;
using Model;
using Model.Enums;
using Service.Base;
using System.Collections.Generic;
using System.Linq;

namespace Service.CptCodes
{
    public class CptCodeAssociationService : CRUDBaseService, ICptCodeAssociationService
    {
        private readonly IPrimaryContext _context;
        public CptCodeAssociationService(IPrimaryContext context, IEmailHelper emailHelper) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
        }
        public bool UpdateAssociations(IEnumerable<CptCodeAssocation> cptCodeAssociations, int userId)
        {
            var cso = new CRUDServiceOptions { currentuserid = userId };
            foreach (var a in cptCodeAssociations)
            {
                var duplicateAssociation = FindDuplicateAssociation(a);
                if (duplicateAssociation != null)
                {
                    duplicateAssociation.Archived = true;
                    Update(duplicateAssociation, cso);
                }

                if (a.Id == 0)
                    Create(a, cso);
                else
                    Update(a, cso);

            }

            if(!cptCodeAssociations.Any(association => !association.Archived && association.ServiceCodeId == (int)ServiceCodes.Nursing))
            {
                var cptCodeId = cptCodeAssociations.First().CptCodeId;
                var cptCode = _context.CptCodes.FirstOrDefault(code => code.Id == cptCodeId);
                cptCode.RnDefault = false;
                cptCode.LpnDefault = false;
                _context.SaveChanges();
                return true;
            }
            return false;

        }

        private CptCodeAssocation FindDuplicateAssociation(CptCodeAssocation association)
        {
            return _context.CptCodeAssocations.FirstOrDefault(a =>
                !a.Archived &&
                a.ServiceCodeId == association.ServiceCodeId &&
                a.ProviderTitleId == association.ProviderTitleId &&
                a.ServiceTypeId == association.ServiceTypeId &&
                a.CptCodeId == association.CptCodeId &&
                a.EvaluationTypeId == association.EvaluationTypeId &&
                a.Id != association.Id);
        }
    }
}
