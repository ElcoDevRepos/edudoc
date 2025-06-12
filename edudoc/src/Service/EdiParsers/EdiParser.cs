using indice.Edi;
using System.IO;
using EDIX12.Models;

namespace Service.EDIParse

{
    public class EDIParser : IEDIParser
    {
        private IEdiGrammar _grammar;
        public EDIParser()
        {
            _grammar = EdiGrammar.NewX12();
        }

        public RosterValidationResponse271 Parse271File(string filePath)
        {
            using (var stream = new StreamReader(filePath))
            {
                return new EdiSerializer().Deserialize<RosterValidationResponse271>(stream, _grammar);
            }
        }

        public HealthClaimResponse835 Parse835File(string filePath)
        {
            using (var stream = new StreamReader(filePath))
            {
                return new EdiSerializer().Deserialize<HealthClaimResponse835>(stream, _grammar);
            }
        }

    }
}
